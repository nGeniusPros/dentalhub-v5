import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';
import { asyncHandler } from '../../utils/asyncHandler';
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

// Get staff performance
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { start_date, end_date, metric } = req.query;

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
  const { id } = req.params;
  const { metric, value, period_start, period_end, notes } = req.body;

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
  const { id, record_id } = req.params;
  const { value, notes } = req.body;

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
  const { id, record_id } = req.params;

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
  const { id } = req.params;
  const { period } = req.query;

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