import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Send individual email
router.post('/send', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { recipient_id, subject, content, template_id } = req.body;

  // Get recipient details
  const { data: recipient, error: recipientError } = await req.supabase
    .from('patients')
    .select('email, first_name, last_name')
    .eq('id', recipient_id)
    .single();

  if (recipientError) {
    return res.status(500).json({ error: recipientError.message });
  }

  if (!recipient.email) {
    return res.status(400).json({ error: 'Recipient has no email address' });
  }

  try {
    // TODO: Implement email provider integration
    // For now, just record the attempt
    const { data: delivery, error: deliveryError } = await req.supabase
      .from('campaign_deliveries')
      .insert({
        recipient_id,
        status: 'sent',
        metadata: {
          subject,
          content,
          template_id,
          recipient_email: recipient.email
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
      error: error instanceof Error ? error.message : 'Failed to send email' 
    });
  }
}));

// Get email templates
router.get('/templates', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { data: templates, error } = await req.supabase
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(templates);
}));

// Create email template
router.post('/templates', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { name, subject, content, variables } = req.body;

  const { data: template, error } = await req.supabase
    .from('email_templates')
    .insert({
      name,
      subject,
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

// Update email template
router.put('/templates/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { name, subject, content, variables } = req.body;

  const { data: template, error } = await req.supabase
    .from('email_templates')
    .update({
      name,
      subject,
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

// Delete email template
router.delete('/templates/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('email_templates')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

// Track email open
router.get('/track/open/:delivery_id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { delivery_id } = req.params;

  // Record email open
  await req.supabase
    .from('campaign_engagements')
    .insert({
      delivery_id,
      type: 'open',
      metadata: {
        user_agent: req.headers['user-agent'],
        ip: req.ip
      }
    });

  // Return tracking pixel
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
}));

// Track email click
router.get('/track/click/:delivery_id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { delivery_id } = req.params;
  const { url } = req.query;

  // Record email click
  await req.supabase
    .from('campaign_engagements')
    .insert({
      delivery_id,
      type: 'click',
      metadata: {
        url,
        user_agent: req.headers['user-agent'],
        ip: req.ip
      }
    });

  // Redirect to original URL
  res.redirect(url as string);
}));

// Get email analytics
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
    .eq('campaigns.type', 'email')
    .gte('timestamp', start_date)
    .lte('timestamp', end_date)
    .order('timestamp', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(analytics);
}));

// Handle email webhook
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