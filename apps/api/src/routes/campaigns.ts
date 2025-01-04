import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Get all campaigns
router.get('/', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { type, status } = req.query;
  let query = req.supabase.from('campaigns').select('*');

  if (type) {
    query = query.eq('type', type);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const { data: campaigns, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(campaigns);
}));

// Get campaign by ID
router.get('/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { data: campaign, error } = await req.supabase
    .from('campaigns')
    .select(`
      *,
      metrics,
      audience,
      content
    `)
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(campaign);
}));

// Create campaign
router.post('/', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { name, type, schedule, audience, content, settings } = req.body;

  const { data: campaign, error } = await req.supabase
    .from('campaigns')
    .insert({
      name,
      type,
      schedule,
      audience,
      content,
      settings,
      status: 'draft',
      metrics: {
        total: 0,
        sent: 0,
        delivered: 0,
        engaged: 0,
        failed: 0
      }
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(campaign);
}));

// Update campaign
router.put('/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { name, type, status, schedule, audience, content, settings, metrics } = req.body;

  const { data: campaign, error } = await req.supabase
    .from('campaigns')
    .update({
      name,
      type,
      status,
      schedule,
      audience,
      content,
      settings,
      metrics
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(campaign);
}));

// Delete campaign
router.delete('/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

// Get campaign analytics
router.get('/:id/analytics', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { start_date, end_date } = req.query;

  const { data: analytics, error } = await req.supabase
    .from('campaign_analytics')
    .select('*')
    .eq('campaign_id', id)
    .gte('timestamp', start_date)
    .lte('timestamp', end_date)
    .order('timestamp', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(analytics);
}));

// Schedule campaign
router.post('/:id/schedule', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { schedule_time } = req.body;

  const { data: campaign, error } = await req.supabase
    .from('campaigns')
    .update({
      status: 'scheduled',
      schedule: { scheduled_time: schedule_time }
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(campaign);
}));

// Send test campaign
router.post('/:id/test', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { test_recipients } = req.body;

  // Get campaign details
  const { data: campaign, error: campaignError } = await req.supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (campaignError) {
    return res.status(500).json({ error: campaignError.message });
  }

  // Send test based on campaign type
  if (campaign.type === 'email') {
    // Send test email
    // TODO: Implement email sending logic
  } else if (campaign.type === 'sms') {
    // Send test SMS
    // TODO: Implement SMS sending logic
  }

  return res.json({ message: 'Test sent successfully' });
}));

// Pause campaign
router.post('/:id/pause', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;

  const { data: campaign, error } = await req.supabase
    .from('campaigns')
    .update({ status: 'paused' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(campaign);
}));

// Resume campaign
router.post('/:id/resume', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;

  const { data: campaign, error } = await req.supabase
    .from('campaigns')
    .update({ status: 'active' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(campaign);
}));

export default router;