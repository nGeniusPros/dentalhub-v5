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

// Get all resources
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.query;
  let query = req.supabase.from('resources').select('*');

  if (type) {
    query = query.eq('type', type);
  }

  const { data: resources, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(resources);
}));

// Get resource by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: resource, error } = await req.supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(resource);
}));

// Create resource
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, type, metadata } = req.body;

  const { data: resource, error } = await req.supabase
    .from('resources')
    .insert({
      name,
      type,
      metadata
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(resource);
}));

// Update resource
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, type, metadata, status } = req.body;

  const { data: resource, error } = await req.supabase
    .from('resources')
    .update({
      name,
      type,
      metadata,
      status
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(resource);
}));

// Delete resource
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('resources')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

export { router as resourceRoutes };