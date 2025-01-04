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

// Get staff tasks
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, priority } = req.query;

  let query = req.supabase
    .from('staff_tasks')
    .select(`
      *,
      comments:staff_task_comments(
        id,
        content,
        created_at,
        user:auth.users!user_id(id, email, raw_user_meta_data)
      )
    `)
    .eq('staff_id', id);

  if (status) {
    query = query.eq('status', status);
  }
  if (priority) {
    query = query.eq('priority', priority);
  }

  const { data: tasks, error } = await query.order('due_date', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(tasks);
}));

// Add task
router.post('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    priority,
    due_date,
    category,
    tags,
    attachments
  } = req.body;

  const { data: task, error } = await req.supabase
    .from('staff_tasks')
    .insert({
      staff_id: id,
      title,
      description,
      priority,
      due_date,
      category,
      tags,
      attachments,
      assigned_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(task);
}));

// Update task status
router.put('/:id/:task_id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, task_id } = req.params;
  const { status, completion_date } = req.body;

  const { data: task, error } = await req.supabase
    .from('staff_tasks')
    .update({
      status,
      completion_date
    })
    .eq('id', task_id)
    .eq('staff_id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(task);
}));

// Add task comment
router.post('/:id/comments', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { task_id } = req.params;
  const { content, attachments } = req.body;

  const { data: comment, error } = await req.supabase
    .from('staff_task_comments')
    .insert({
      task_id,
      user_id: req.user?.id,
      content,
      attachments
    })
    .select(`
      *,
      user:auth.users!user_id(id, email, raw_user_meta_data)
    `)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(comment);
}));

export { router as taskRoutes };