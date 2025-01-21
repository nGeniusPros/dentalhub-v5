import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { profileRoutes } from './staff/profiles';
import { performanceRoutes } from './staff/performance';
import { trainingRoutes } from './staff/training';
import { taskRoutes } from './staff/tasks';
import { z } from 'zod';
const router = Router();
const getStaffSchema = z.object({
    role: z.string().optional(),
    status: z.string().optional(),
});
const staffIdSchema = z.object({
    id: z.string().min(1),
});
const createStaffSchema = z.object({
    user_id: z.string().min(1),
    role: z.string().min(1),
    specialization: z.string().optional(),
    license_number: z.string().optional(),
    license_expiry: z.string().optional(),
    certifications: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    bio: z.string().optional(),
    contact_info: z.any().optional(),
    emergency_contact: z.any().optional(),
    hire_date: z.string().optional(),
});
const updateStaffSchema = z.object({
    role: z.string().min(1).optional(),
    specialization: z.string().optional(),
    license_number: z.string().optional(),
    license_expiry: z.string().optional(),
    certifications: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    bio: z.string().optional(),
    contact_info: z.any().optional(),
    emergency_contact: z.any().optional(),
    status: z.string().optional(),
    termination_date: z.string().optional(),
});
// Mount sub-routers
router.use('/profiles', profileRoutes);
router.use('/performance', performanceRoutes);
router.use('/training', trainingRoutes);
router.use('/tasks', taskRoutes);
// Get all staff profiles
router.get('/', asyncHandler(async (req, res) => {
    const validationResult = getStaffSchema.safeParse(req.query);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const { role, status } = validationResult.data;
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
router.get('/:id', asyncHandler(async (req, res) => {
    const validationResult = staffIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid staff ID' });
    }
    const { id } = validationResult.data;
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
router.post('/', asyncHandler(async (req, res) => {
    const validationResult = createStaffSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid staff data' });
    }
    const { user_id, role, specialization, license_number, license_expiry, certifications, education, skills, bio, contact_info, emergency_contact, hire_date } = validationResult.data;
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
router.put('/:id', asyncHandler(async (req, res) => {
    const validationResult = staffIdSchema.safeParse(req.params);
    const updateValidationResult = updateStaffSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid staff ID' });
    }
    if (!updateValidationResult.success) {
        return res.status(400).json({ error: 'Invalid staff data' });
    }
    const { id } = validationResult.data;
    const { role, specialization, license_number, license_expiry, certifications, education, skills, bio, contact_info, emergency_contact, status, termination_date } = updateValidationResult.data;
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
