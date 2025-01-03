import { Router, Request, Response } from 'express';
import { Database, Tables } from '../types/database.types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const router: Router = Router();

// GET /campaigns
router.get('/', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { data, error } = await req.supabase
    .from('campaigns')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// GET /campaigns/:id
router.get('/:id', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { data, error } = await req.supabase
    .from('campaigns')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  return res.json(data);
});

// POST /campaigns
router.post('/', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { name, type, audience, content } = req.body;

  const { data, error } = await req.supabase
    .from('campaigns')
    .insert([
      {
        name,
        type,
        status: 'draft',
        audience,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json(data);
});

// PUT /campaigns/:id
router.put('/:id', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { name, type, status, audience, content } = req.body;

  const { data, error } = await req.supabase
    .from('campaigns')
    .update({
      name,
      type,
      status,
      audience,
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
});

// DELETE /campaigns/:id
router.delete('/:id', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { error } = await req.supabase
    .from('campaigns')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(204).send();
});

export default router;