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

// Get all courses
router.get('/courses', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, category } = req.query;

  let query = req.supabase
    .from('courses')
    .select(`
      *,
      modules:course_modules(
        id,
        title,
        description,
        order_index,
        duration
      )
    `);

  if (status) {
    query = query.eq('status', status);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data: courses, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(courses);
}));

// Get course by ID
router.get('/courses/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: course, error } = await req.supabase
    .from('courses')
    .select(`
      *,
      modules:course_modules(
        id,
        title,
        description,
        order_index,
        duration,
        content:module_content(
          id,
          title,
          content_type,
          content_url,
          content_data,
          order_index,
          duration
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(course);
}));

// Create course
router.post('/courses', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    description,
    category,
    duration,
    prerequisites,
    learning_objectives,
    thumbnail_url
  } = req.body;

  const { data: course, error } = await req.supabase
    .from('courses')
    .insert({
      title,
      description,
      category,
      duration,
      prerequisites,
      learning_objectives,
      thumbnail_url,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(course);
}));

// Update course
router.put('/courses/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    category,
    duration,
    prerequisites,
    learning_objectives,
    thumbnail_url
  } = req.body;

  const updates: any = {
    title,
    description,
    category,
    duration,
    prerequisites,
    learning_objectives,
    thumbnail_url
  };

  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { data: course, error } = await req.supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(course);
}));

// Add module to course
router.post('/courses/:id/modules', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, order_index, duration } = req.body;

  const { data: module, error } = await req.supabase
    .from('course_modules')
    .insert({
      course_id: id,
      title,
      description,
      order_index,
      duration
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(module);
}));

// Add content to module
router.post('/modules/:id/content', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content_type, content_url, content_data, order_index, duration } = req.body;

  const { data: content, error } = await req.supabase
    .from('module_content')
    .insert({
      module_id: id,
      title,
      content_type,
      content_url,
      content_data,
      order_index,
      duration
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(content);
}));

// Enroll in course
router.post('/courses/:id/enroll', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: enrollment, error } = await req.supabase
    .from('course_enrollments')
    .insert({
      course_id: id,
      user_id: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(enrollment);
}));

// Update progress
router.post('/progress', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { enrollment_id, module_id, content_id, completed, quiz_score, time_spent } = req.body;

  const { data: progress, error } = await req.supabase
    .from('module_progress')
    .upsert({
      enrollment_id,
      module_id,
      content_id,
      completed,
      completion_date: completed ? new Date().toISOString() : null,
      quiz_score,
      time_spent
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Update enrollment progress
  const { data: moduleProgress } = await req.supabase
    .from('module_progress')
    .select('completed')
    .eq('enrollment_id', enrollment_id);

  const totalModules = moduleProgress?.length || 0;
  const completedModules = moduleProgress?.filter(p => p.completed)?.length || 0;
  const progressPercentage = Math.round((completedModules / totalModules) * 100);

  await req.supabase
    .from('course_enrollments')
    .update({
      progress: progressPercentage,
      completion_date: progressPercentage === 100 ? new Date().toISOString() : null,
      status: progressPercentage === 100 ? 'completed' : 'in_progress',
      last_accessed_at: new Date().toISOString()
    })
    .eq('id', enrollment_id);

  return res.json(progress);
}));

// Get learning resources
router.get('/resources', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type, category } = req.query;

  let query = req.supabase
    .from('learning_resources')
    .select('*');

  if (type) {
    query = query.eq('resource_type', type);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data: resources, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(resources);
}));

// Add learning resource
router.post('/resources', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, resource_type, category, tags, url, file_data } = req.body;

  const { data: resource, error } = await req.supabase
    .from('learning_resources')
    .insert({
      title,
      description,
      resource_type,
      category,
      tags,
      url,
      file_data,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(resource);
}));

// Get certifications
router.get('/certifications', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data: certifications, error } = await req.supabase
    .from('certifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(certifications);
}));

// Get user certifications
router.get('/certifications/user/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: certifications, error } = await req.supabase
    .from('user_certifications')
    .select(`
      *,
      certification:certifications(*)
    `)
    .eq('user_id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(certifications);
}));

// Update certification status
router.put('/certifications/:id/status', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, issue_date, expiry_date, certificate_url, verification_code } = req.body;

  const { data: certification, error } = await req.supabase
    .from('user_certifications')
    .update({
      status,
      issue_date,
      expiry_date,
      certificate_url,
      verification_code
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(certification);
}));

export default router;