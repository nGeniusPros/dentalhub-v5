import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { z } from 'zod';

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

const analyticsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

const revenueAnalyticsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  group_by: z.enum(['month', 'year']).optional(),
});

// Revenue analytics
router.get('/revenue', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = revenueAnalyticsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { start_date, end_date, group_by = 'month' } = validationResult.data;

  // Get revenue entries
  const { data: entries, error } = await req.supabase
    .from('revenue_entries')
    .select('entry_date, category, amount')
    .gte('entry_date', start_date)
    .lte('entry_date', end_date);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Calculate analytics
  const analytics = {
    total_revenue: 0,
    by_category: {} as Record<string, number>,
    by_period: {} as Record<string, number>
  };

  entries?.forEach(entry => {
    // Total revenue
    analytics.total_revenue += entry.amount;

    // Revenue by category
    if (!analytics.by_category[entry.category]) {
      analytics.by_category[entry.category] = 0;
    }
    analytics.by_category[entry.category] += entry.amount;

    // Revenue by period
    const period = group_by === 'month'
      ? entry.entry_date.substring(0, 7) // YYYY-MM
      : entry.entry_date.substring(0, 4); // YYYY

    if (!analytics.by_period[period]) {
      analytics.by_period[period] = 0;
    }
    analytics.by_period[period] += entry.amount;
  });

  return res.json(analytics);
}));

// Patient analytics
router.get('/patients', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = analyticsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { start_date, end_date } = validationResult.data;

  // Get patient data
  const { data: patients, error } = await req.supabase
    .from('auth.users')
    .select('id, created_at')
    .gte('created_at', start_date)
    .lte('created_at', end_date);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Calculate analytics
  const analytics = {
    total_patients: patients?.length || 0,
    new_patients: 0,
    returning_patients: 0
  };

  // Get appointment data
  const { data: appointments, error: appointmentsError } = await req.supabase
    .from('appointments')
    .select('patient_id, start_time')
    .gte('start_time', start_date)
    .lte('start_time', end_date);

  if (appointmentsError) {
    return res.status(500).json({ error: appointmentsError.message });
  }

  const patientIds = new Set(patients?.map(p => p.id));
  const returningPatientIds = new Set();

  appointments?.forEach(appointment => {
    if (patientIds.has(appointment.patient_id)) {
      if (returningPatientIds.has(appointment.patient_id)) {
        analytics.returning_patients += 1;
      } else {
        returningPatientIds.add(appointment.patient_id);
      }
    }
  });

  analytics.new_patients = analytics.total_patients - returningPatientIds.size;

  return res.json(analytics);
}));

// Treatment analytics
router.get('/treatments', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = analyticsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

    const { start_date, end_date } = validationResult.data;

    // Get appointment data
    const { data: appointments, error } = await req.supabase
      .from('appointments')
      .select('start_time, treatment_type')
      .gte('start_time', start_date)
      .lte('start_time', end_date);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate analytics
    const analytics = {
      total_treatments: appointments?.length || 0,
      by_treatment_type: {} as Record<string, number>
    };

    appointments?.forEach(appointment => {
      if (!analytics.by_treatment_type[appointment.treatment_type]) {
        analytics.by_treatment_type[appointment.treatment_type] = 0;
      }
      analytics.by_treatment_type[appointment.treatment_type] += 1;
    });

    return res.json(analytics);
}));

// Campaign performance
router.get('/campaigns', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = analyticsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { start_date, end_date } = validationResult.data;

  // Get campaign data
  const { data: campaigns, error } = await req.supabase
    .from('campaigns')
    .select('id, name, created_at')
    .gte('created_at', start_date)
    .lte('created_at', end_date);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Get campaign communication data
  const { data: communications, error: communicationsError } = await req.supabase
    .from('communication_logs')
    .select('campaign_id, status')
    .gte('created_at', start_date)
    .lte('created_at', end_date);

  if (communicationsError) {
    return res.status(500).json({ error: communicationsError.message });
  }

  // Calculate analytics
  const analytics = campaigns?.map(campaign => {
    const campaignCommunications = communications?.filter(c => c.campaign_id === campaign.id);
    const sent = campaignCommunications?.length || 0;
    const delivered = campaignCommunications?.filter(c => c.status === 'delivered')?.length || 0;
    const opened = campaignCommunications?.filter(c => c.status === 'opened')?.length || 0;
    const clicked = campaignCommunications?.filter(c => c.status === 'clicked')?.length || 0;

    return {
      id: campaign.id,
      name: campaign.name,
      sent,
      delivered,
      opened,
      clicked
    };
  });

  return res.json(analytics);
}));

// Staff performance
router.get('/staff', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = analyticsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { start_date, end_date } = validationResult.data;

  // Get staff performance data
  const { data: performance, error } = await req.supabase
    .from('staff_performance')
    .select('staff_id, metric, value')
    .gte('period_start', start_date)
    .lte('period_end', end_date);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Calculate analytics
  const analytics = {} as Record<string, Record<string, number>>;

  performance?.forEach(item => {
    if (!analytics[item.staff_id]) {
      analytics[item.staff_id] = {};
    }
    analytics[item.staff_id][item.metric] = (analytics[item.staff_id][item.metric] || 0) + item.value;
  });

  return res.json(analytics);
}));

export default router;