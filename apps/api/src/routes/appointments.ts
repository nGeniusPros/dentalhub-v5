import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { availabilityRoutes } from './appointments/availability';
import { resourceRoutes } from './appointments/resources';

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
router.use('/availability', availabilityRoutes);
router.use('/resources', resourceRoutes);

// Get all appointments
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { start_date, end_date, status, provider_id, patient_id } = req.query;
  
  let query = req.supabase
    .from('appointments')
    .select(`
      *,
      patient:patients!inner(id, first_name, last_name, email, phone),
      provider:users!provider_id(id, email, raw_user_meta_data),
      resources:appointment_resources(
        id,
        resource:resources(id, name, type)
      ),
      comments:appointment_comments(
        id,
        content,
        created_at,
        user:users(id, email, raw_user_meta_data)
      )
    `);

  if (start_date) {
    query = query.gte('start_time', start_date as string);
  }
  if (end_date) {
    query = query.lte('end_time', end_date as string);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (provider_id) {
    query = query.eq('provider_id', provider_id);
  }
  if (patient_id) {
    query = query.eq('patient_id', patient_id);
  }

  const { data: appointments, error } = await query.order('start_time', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(appointments);
}));

// Get appointment by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: appointment, error } = await req.supabase
    .from('appointments')
    .select(`
      *,
      patient:patients!inner(id, first_name, last_name, email, phone),
      provider:users!provider_id(id, email, raw_user_meta_data),
      resources:appointment_resources(
        id,
        resource:resources(id, name, type)
      ),
      comments:appointment_comments(
        id,
        content,
        created_at,
        user:users(id, email, raw_user_meta_data)
      ),
      reminders:appointment_reminders(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(appointment);
}));

// Create appointment
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    patient_id,
    provider_id,
    type,
    start_time,
    end_time,
    duration,
    notes,
    resources,
    reminders
  } = req.body;

  // Start transaction
  const { data: appointment, error: appointmentError } = await req.supabase
    .from('appointments')
    .insert({
      patient_id,
      provider_id,
      type,
      start_time,
      end_time,
      duration,
      notes,
      created_by: req.user?.id
    })
    .select()
    .single();

  if (appointmentError) {
    return res.status(500).json({ error: appointmentError.message });
  }

  // Add resources
  if (resources && resources.length > 0) {
    const { error: resourceError } = await req.supabase
      .from('appointment_resources')
      .insert(
        resources.map((resource: any) => ({
          appointment_id: appointment.id,
          resource_id: resource.id,
          resource_type: resource.type
        }))
      );

    if (resourceError) {
      return res.status(500).json({ error: resourceError.message });
    }
  }

  // Schedule reminders
  if (reminders && reminders.length > 0) {
    const { error: reminderError } = await req.supabase
      .from('appointment_reminders')
      .insert(
        reminders.map((reminder: any) => ({
          appointment_id: appointment.id,
          type: reminder.type,
          scheduled_time: reminder.scheduled_time
        }))
      );

    if (reminderError) {
      return res.status(500).json({ error: reminderError.message });
    }
  }

  return res.status(201).json(appointment);
}));

// Update appointment
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    patient_id,
    provider_id,
    type,
    status,
    start_time,
    end_time,
    duration,
    notes,
    resources,
    reminders
  } = req.body;

  // Update appointment
  const { data: appointment, error: appointmentError } = await req.supabase
    .from('appointments')
    .update({
      patient_id,
      provider_id,
      type,
      status,
      start_time,
      end_time,
      duration,
      notes
    })
    .eq('id', id)
    .select()
    .single();

  if (appointmentError) {
    return res.status(500).json({ error: appointmentError.message });
  }

  // Update resources
  if (resources) {
    await req.supabase
      .from('appointment_resources')
      .delete()
      .eq('appointment_id', id);

    if (resources.length > 0) {
      const { error: resourceError } = await req.supabase
        .from('appointment_resources')
        .insert(
          resources.map((resource: any) => ({
            appointment_id: id,
            resource_id: resource.id,
            resource_type: resource.type
          }))
        );

      if (resourceError) {
        return res.status(500).json({ error: resourceError.message });
      }
    }
  }

  // Update reminders
  if (reminders) {
    await req.supabase
      .from('appointment_reminders')
      .delete()
      .eq('appointment_id', id);

    if (reminders.length > 0) {
      const { error: reminderError } = await req.supabase
        .from('appointment_reminders')
        .insert(
          reminders.map((reminder: any) => ({
            appointment_id: id,
            type: reminder.type,
            scheduled_time: reminder.scheduled_time
          }))
        );

      if (reminderError) {
        return res.status(500).json({ error: reminderError.message });
      }
    }
  }

  return res.json(appointment);
}));

// Cancel appointment
router.post('/:id/cancel', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const { data: appointment, error } = await req.supabase
    .from('appointments')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
      cancellation_time: new Date().toISOString(),
      cancelled_by: req.user?.id
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(appointment);
}));

// Add comment to appointment
router.post('/:id/comments', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  const { data: comment, error } = await req.supabase
    .from('appointment_comments')
    .insert({
      appointment_id: id,
      user_id: req.user?.id,
      content
    })
    .select(`
      *,
      user:users(id, email, raw_user_meta_data)
    `)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(comment);
}));

export default router;