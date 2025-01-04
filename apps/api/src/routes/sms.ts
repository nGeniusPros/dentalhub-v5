import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Send individual SMS
router.post('/send', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { recipient_id, message, template_id } = req.body;

  // Get recipient details
  const { data: recipient, error: recipientError } = await req.supabase
    .from('patients')
    .select('phone, first_name, last_name')
    .eq('id', recipient_id)
    .single();

  if (recipientError) {
    return res.status(500).json({ error: recipientError.message });
  }

  if (!recipient.phone) {
    return res.status(400).json({ error: 'Recipient has no phone number' });
  }

  try {
    // TODO: Implement SMS provider integration
    // For now, just record the attempt
    const { data: delivery, error: deliveryError } = await req.supabase
      .from('campaign_deliveries')
      .insert({
        recipient_id,
        status: 'sent',
        metadata: {
          message,
          template_id,
          recipient_phone: recipient.phone
        },
        sent_at: new Date().toISOString()
      })
      .select()
      .single();

    if (deliveryError) {
      throw deliveryError;
    }

    return res.json(delivery);
  } catch (error) {
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to send SMS' 
    });
  }
}));

// Get SMS templates
router.get('/templates', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { data: templates, error } = await req.supabase
    .from('sms_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(templates);
}));

// Create SMS template
router.post('/templates', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { name, content, variables } = req.body;

  const { data: template, error } = await req.supabase
    .from('sms_templates')
    .insert({
      name,
      content,
      variables
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(template);
}));

// Update SMS template
router.put('/templates/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { name, content, variables } = req.body;

  const { data: template, error } = await req.supabase
    .from('sms_templates')
    .update({
      name,
      content,
      variables
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(template);
}));

// Delete SMS template
router.delete('/templates/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('sms_templates')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

// Get SMS delivery status
router.get('/status/:delivery_id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { delivery_id } = req.params;

  const { data: delivery, error } = await req.supabase
    .from('campaign_deliveries')
    .select('*')
    .eq('id', delivery_id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(delivery);
}));

// Get SMS analytics
router.get('/analytics', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { start_date, end_date } = req.query;

  const { data: analytics, error } = await req.supabase
    .from('campaign_analytics')
    .select(`
      id,
      timestamp,
      metrics,
      campaigns!inner(
        id,
        name,
        type
      )
    `)
    .eq('campaigns.type', 'sms')
    .gte('timestamp', start_date)
    .lte('timestamp', end_date)
    .order('timestamp', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(analytics);
}));

// Handle SMS webhook
router.post('/webhook', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { provider_message_id, status, error_message } = req.body;

  // Update delivery status
  const { data: delivery, error } = await req.supabase
    .from('campaign_deliveries')
    .update({
      status,
      error_message,
      delivered_at: status === 'delivered' ? new Date().toISOString() : null,
      failed_at: status === 'failed' ? new Date().toISOString() : null
    })
    .eq('provider_message_id', provider_message_id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Update campaign metrics
  if (delivery) {
    const { data: campaign, error: campaignError } = await req.supabase
      .from('campaigns')
      .select('metrics')
      .eq('id', delivery.campaign_id)
      .single();

    if (!campaignError && campaign) {
      const metrics = campaign.metrics;
      metrics[status] = (metrics[status] || 0) + 1;

      await req.supabase
        .from('campaigns')
        .update({ metrics })
        .eq('id', delivery.campaign_id);
    }
  }

  return res.json({ success: true });
}));

export default router;