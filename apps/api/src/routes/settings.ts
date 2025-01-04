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

// Get all practice settings
router.get('/practice', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data: settings, error } = await req.supabase
    .from('practice_settings')
    .select('*')
    .order('setting_key', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(settings);
}));

// Get practice setting by key
router.get('/practice/:key', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;

  const { data: setting, error } = await req.supabase
    .from('practice_settings')
    .select('*')
    .eq('setting_key', key)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(setting);
}));

// Create practice setting
router.post('/practice', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { setting_key, setting_value, setting_type, description } = req.body;

  const { data: setting, error } = await req.supabase
    .from('practice_settings')
    .insert({
      setting_key,
      setting_value,
      setting_type,
      description,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(setting);
}));

// Update practice setting
router.put('/practice/:key', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  const { setting_value, description } = req.body;

  const { data: setting, error } = await req.supabase
    .from('practice_settings')
    .update({
      setting_value,
      description
    })
    .eq('setting_key', key)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(setting);
}));

// Get all user permissions
router.get('/permissions', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data: permissions, error } = await req.supabase
    .from('user_permissions')
    .select(`
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(permissions);
}));

// Get user permissions by user ID
router.get('/permissions/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: permissions, error } = await req.supabase
    .from('user_permissions')
    .select(`
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(permissions);
}));

// Set user permission
router.post('/permissions', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { user_id, permission_key, permission_type } = req.body;

  const { data: permission, error } = await req.supabase
    .from('user_permissions')
    .insert({
      user_id,
      permission_key,
      permission_type,
      created_by: req.user?.id
    })
    .select(`
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(permission);
}));

// Update user permission
router.put('/permissions/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { permission_type } = req.body;

  const { data: permission, error } = await req.supabase
    .from('user_permissions')
    .update({
      permission_type
    })
    .eq('id', id)
    .select(`
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(permission);
}));

// Get all system configurations
router.get('/config', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data: config, error } = await req.supabase
    .from('system_configuration')
    .select('*')
    .order('config_key', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(config);
}));

// Get system configuration by key
router.get('/config/:key', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;

  const { data: config, error } = await req.supabase
    .from('system_configuration')
    .select('*')
    .eq('config_key', key)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(config);
}));

// Create system configuration
router.post('/config', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { config_key, config_value, config_type, description } = req.body;

  const { data: config, error } = await req.supabase
    .from('system_configuration')
    .insert({
      config_key,
      config_value,
      config_type,
      description,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(config);
}));

// Update system configuration
router.put('/config/:key', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  const { config_value, description } = req.body;

  const { data: config, error } = await req.supabase
    .from('system_configuration')
    .update({
      config_value,
      description
    })
    .eq('config_key', key)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(config);
}));

// Get all integration settings
router.get('/integrations', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data: settings, error } = await req.supabase
    .from('integration_settings')
    .select('*')
    .order('integration_key', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(settings);
}));

// Get integration setting by key
router.get('/integrations/:key', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;

  const { data: setting, error } = await req.supabase
    .from('integration_settings')
    .select('*')
    .eq('integration_key', key)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(setting);
}));

// Create integration setting
router.post('/integrations', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { integration_key, settings_value, settings_type, description } = req.body;

  const { data: setting, error } = await req.supabase
    .from('integration_settings')
    .insert({
      integration_key,
      settings_value,
      settings_type,
      description,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(setting);
}));

// Update integration setting
router.put('/integrations/:key', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  const { settings_value, description } = req.body;

  const { data: setting, error } = await req.supabase
    .from('integration_settings')
    .update({
      settings_value,
      description
    })
    .eq('integration_key', key)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(setting);
}));

export default router;