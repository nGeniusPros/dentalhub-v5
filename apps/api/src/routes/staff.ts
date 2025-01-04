import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { profileRoutes } from './staff/profiles';
import { performanceRoutes } from './staff/performance';
import { trainingRoutes } from './staff/training';
import { taskRoutes } from './staff/tasks';

interface AuthenticatedRequest extends Request {
		supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

// Mount sub-routers
router.use('/profiles', profileRoutes);
router.use('/performance', performanceRoutes);
router.use('/training', trainingRoutes);
router.use('/tasks', taskRoutes);

// Get all staff profiles
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { role, status } = req.query;
  let query = req.supabase
    .from('staff_profiles')
    .select(`
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `);

  if (role) {
    query = query.eq('role', role);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const { data: staff, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(staff);
}));

// Get staff profile by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: staff, error } = await req.supabase
    .from('staff_profiles')
    .select(`
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      ),
      schedules:staff_schedules(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(staff);
}));

// Create staff profile
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    user_id,
    role,
    specialization,
    license_number,
    license_expiry,
    certifications,
    education,
    skills,
    bio,
    contact_info,
    emergency_contact,
    hire_date
  } = req.body;

  const { data: staff, error } = await req.supabase
    .from('staff_profiles')
    .insert({
      user_id,
      role,
      specialization,
      license_number,
      license_expiry,
      certifications,
      education,
      skills,
      bio,
      contact_info,
      emergency_contact,
      hire_date
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(staff);
}));

// Update staff profile
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    role,
    specialization,
    license_number,
    license_expiry,
    certifications,
    education,
    skills,
    bio,
    contact_info,
    emergency_contact,
    status,
    termination_date
  } = req.body;

  const { data: staff, error } = await req.supabase
    .from('staff_profiles')
    .update({
      role,
      specialization,
      license_number,
      license_expiry,
      certifications,
      education,
      skills,
      bio,
      contact_info,
      emergency_contact,
      status,
      termination_date
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(staff);
}));

export default router;