import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

// Get revenue entries
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { start_date, end_date, category } = req.query;

  let query = req.supabase
    .from('revenue_entries')
    .select('*');

  if (start_date) {
    query = query.gte('entry_date', start_date);
  }
  if (end_date) {
    query = query.lte('entry_date', end_date);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data: entries, error } = await query.order('entry_date', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(entries);
}));

// Add revenue entry
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    entry_date,
    category,
    amount,
    source,
    reference_id,
    reference_type,
    notes
  } = req.body;

  const { data: entry, error } = await req.supabase
    .from('revenue_entries')
    .insert({
      entry_date,
      category,
      amount,
      source,
      reference_id,
      reference_type,
      notes,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(entry);
}));

// Get revenue analytics
router.get('/analytics', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { start_date, end_date, group_by = 'month' } = req.query;

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

// Get accounts receivable
router.get('/ar', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;

  let query = req.supabase
    .from('accounts_receivable')
    .select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      )
    `);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: ar, error } = await query.order('due_date', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(ar);
}));

// Get AR aging report
router.get('/ar/aging', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data: ar, error } = await req.supabase
    .from('accounts_receivable')
    .select('remaining_amount, aging_days')
    .gt('remaining_amount', 0);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Calculate aging buckets
  const aging = {
    current: 0,
    '30_days': 0,
    '60_days': 0,
    '90_days': 0,
    '120_plus_days': 0
  };

  ar?.forEach(item => {
    const amount = item.remaining_amount;
    if (item.aging_days <= 30) {
      aging.current += amount;
    } else if (item.aging_days <= 60) {
      aging['30_days'] += amount;
    } else if (item.aging_days <= 90) {
      aging['60_days'] += amount;
    } else if (item.aging_days <= 120) {
      aging['90_days'] += amount;
    } else {
      aging['120_plus_days'] += amount;
    }
  });

  return res.json(aging);
}));

// Create payment plan
router.post('/payment-plans', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    patient_id,
    total_amount,
    installment_amount,
    frequency,
    start_date,
    end_date,
    notes
  } = req.body;

  const { data: plan, error } = await req.supabase
    .from('payment_plans')
    .insert({
      patient_id,
      total_amount,
      remaining_amount: total_amount,
      installment_amount,
      frequency,
      start_date,
      end_date,
      next_payment_date: start_date,
      status: 'active',
      notes
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(plan);
}));

// Update payment plan
router.put('/payment-plans/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    remaining_amount,
    next_payment_date,
    status,
    notes
  } = req.body;

  const { data: plan, error } = await req.supabase
    .from('payment_plans')
    .update({
      remaining_amount,
      next_payment_date,
      status,
      notes
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(plan);
}));

export default router;