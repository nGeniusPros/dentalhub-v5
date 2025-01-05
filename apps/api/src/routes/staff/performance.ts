import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';
import { asyncHandler } from '../../utils/asyncHandler';
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

const staffIdSchema = z.object({
  id: z.string().min(1),
});

const getPerformanceSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  metric: z.string().optional(),
});

const addPerformanceSchema = z.object({
  metric: z.string().min(1),
  value: z.number(),
  period_start: z.string().min(1),
  period_end: z.string().min(1),
  notes: z.string().optional(),
});

const updatePerformanceSchema = z.object({
  value: z.number(),
  notes: z.string().optional(),
});

const recordIdSchema = z.object({
  record_id: z.string().min(1),
});

const performanceSummarySchema = z.object({
  period: z.enum(['month', 'quarter', 'year']).optional(),
});

// Get staff performance
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = staffIdSchema.safeParse(req.params);
  const queryValidationResult = getPerformanceSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!queryValidationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { id } = validationResult.data;
  const { start_date, end_date, metric } = queryValidationResult.data;

  let query = req.supabase
    .from('staff_performance')
    .select(`
      *,
      evaluator:auth.users!evaluated_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .eq('staff_id', id);

  if (start_date) {
    query = query.gte('period_start', start_date);
  }
  if (end_date) {
    query = query.lte('period_end', end_date);
  }
  if (metric) {
    query = query.eq('metric', metric);
  }

  const { data: performance, error } = await query.order('period_start', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(performance);
}));

// Add performance record
router.post('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = staffIdSchema.safeParse(req.params);
  const recordValidationResult = addPerformanceSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!recordValidationResult.success) {
    return res.status(400).json({ error: 'Invalid performance data' });
  }

  const { id } = validationResult.data;
  const { metric, value, period_start, period_end, notes } = recordValidationResult.data;

  const { data: performance, error } = await req.supabase
    .from('staff_performance')
    .insert({
      staff_id: id,
      metric,
      value,
      period_start,
      period_end,
      notes,
      evaluated_by: req.user?.id
    })
    .select(`
      *,
      evaluator:auth.users!evaluated_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(performance);
}));

// Update performance record
router.put('/:id/:record_id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = staffIdSchema.safeParse(req.params);
  const recordValidationResult = recordIdSchema.safeParse(req.params);
  const updateValidationResult = updatePerformanceSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!recordValidationResult.success) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }
  if (!updateValidationResult.success) {
    return res.status(400).json({ error: 'Invalid performance data' });
  }

  const { id, record_id } = validationResult.data;
  const { value, notes } = updateValidationResult.data;

  const { data: performance, error } = await req.supabase
    .from('staff_performance')
    .update({
      value,
      notes,
      evaluated_by: req.user?.id
    })
    .eq('id', record_id)
    .eq('staff_id', id)
    .select(`
      *,
      evaluator:auth.users!evaluated_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(performance);
}));

// Delete performance record
router.delete('/:id/:record_id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = staffIdSchema.safeParse(req.params);
  const recordValidationResult = recordIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!recordValidationResult.success) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  const { id, record_id } = validationResult.data;

  const { error } = await req.supabase
    .from('staff_performance')
    .delete()
    .eq('id', record_id)
    .eq('staff_id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

// Get performance summary
router.get('/:id/summary', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = staffIdSchema.safeParse(req.params);
  const summaryValidationResult = performanceSummarySchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!summaryValidationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { id } = validationResult.data;
  const { period } = summaryValidationResult.data;

  const startDate = period === 'year'
    ? new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    : new Date(new Date().setMonth(new Date().getMonth() - (period === 'quarter' ? 3 : 1)));

  const { data: performance, error } = await req.supabase
    .from('staff_performance')
    .select('metric, value')
    .eq('staff_id', id)
    .gte('period_start', startDate.toISOString());

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  interface MetricSummary {
    total: number;
    count: number;
  }

  // Calculate averages by metric
  const summary = performance?.reduce((acc: Record<string, MetricSummary>, curr) => {
    if (!acc[curr.metric]) {
      acc[curr.metric] = { total: 0, count: 0 };
    }
    acc[curr.metric].total += curr.value;
    acc[curr.metric].count += 1;
    return acc;
  }, {} as Record<string, MetricSummary>);

  const averages = Object.entries(summary || {}).reduce((acc: Record<string, number>, [metric, data]) => {
    acc[metric] = data.total / data.count;
    return acc;
  }, {} as Record<string, number>);

  return res.json(averages);
}));

export { router as performanceRoutes };