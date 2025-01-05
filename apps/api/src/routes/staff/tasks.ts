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

const getTasksSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.string().min(1),
  due_date: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
});

const updateTaskStatusSchema = z.object({
  status: z.string().min(1),
  completion_date: z.string().optional(),
});

const taskIdSchema = z.object({
  task_id: z.string().min(1),
});

const addCommentSchema = z.object({
  content: z.string().min(1),
  attachments: z.array(z.string()).optional(),
});

// Get staff tasks
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = staffIdSchema.safeParse(req.params);
  const queryValidationResult = getTasksSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!queryValidationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { id } = validationResult.data;
  const { status, priority } = queryValidationResult.data;

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
  const validationResult = staffIdSchema.safeParse(req.params);
  const taskValidationResult = createTaskSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!taskValidationResult.success) {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  const { id } = validationResult.data;
  const {
    title,
    description,
    priority,
    due_date,
    category,
    tags,
    attachments
  } = taskValidationResult.data;

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
  const validationResult = staffIdSchema.safeParse(req.params);
  const taskValidationResult = taskIdSchema.safeParse(req.params);
    const updateValidationResult = updateTaskStatusSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
    if (!taskValidationResult.success) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    if (!updateValidationResult.success) {
        return res.status(400).json({ error: 'Invalid task status data' });
    }

  const { id, task_id } = validationResult.data;
  const { status, completion_date } = updateValidationResult.data;

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
  const validationResult = staffIdSchema.safeParse(req.params);
  const commentValidationResult = addCommentSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }
  if (!commentValidationResult.success) {
    return res.status(400).json({ error: 'Invalid comment data' });
  }

  const { id } = validationResult.data;
  const { content, attachments } = commentValidationResult.data;

  const { data: comment, error } = await req.supabase
    .from('staff_task_comments')
    .insert({
      task_id: id,
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