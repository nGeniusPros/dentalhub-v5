import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { AppointmentService } from '../services/appointmentService';
import subRoutes from './appointments/index';

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

const createAppointmentSchema = z.object({
  patient_id: z.string().min(1),
  provider_id: z.string().min(1),
  type: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  duration: z.number().min(1),
  notes: z.string().optional(),
  resources: z.array(z.object({
    id: z.string().min(1),
    type: z.string().min(1),
  })).optional(),
  reminders: z.array(z.object({
    type: z.string().min(1),
    scheduled_time: z.string().min(1),
  })).optional(),
});

const updateAppointmentSchema = z.object({
  patient_id: z.string().min(1).optional(),
  provider_id: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  status: z.string().optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  duration: z.number().min(1).optional(),
  notes: z.string().optional(),
  resources: z.array(z.object({
    id: z.string().min(1),
    type: z.string().min(1),
  })).optional(),
  reminders: z.array(z.object({
    type: z.string().min(1),
    scheduled_time: z.string().min(1),
  })).optional(),
});

const getAppointmentsSchema = z.object({
		start_date: z.string().optional(),
	end_date: z.string().optional(),
		status: z.string().optional(),
		provider_id: z.string().optional(),
  patient_id: z.string().optional(),
});

const appointmentIdSchema = z.object({
  id: z.string().min(1),
});

const cancelAppointmentSchema = z.object({
  reason: z.string().min(1),
});

const addCommentSchema = z.object({
		content: z.string().min(1),
});

// Mount sub-routers
router.use('/', subRoutes);

// Get all appointments
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
	const validationResult = getAppointmentsSchema.safeParse(req.query);
  if (!validationResult.success) {
				return res.status(400).json({ error: 'Invalid query parameters' });
	}

		const { start_date, end_date, status, provider_id, patient_id } = validationResult.data;
  const appointmentService = new AppointmentService(req.supabase);
  const { data: appointments, error } = await appointmentService.getAllAppointments(start_date, end_date, status, provider_id, patient_id);

  if (error) {
			return res.status(500).json({ error: error.message });
  }

  return res.json(appointments);
}));

// Get appointment by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = appointmentIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  const { id } = validationResult.data;
  const appointmentService = new AppointmentService(req.supabase);
  const { data: appointment, error } = await appointmentService.getAppointmentById(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(appointment);
}));

// Create appointment
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = createAppointmentSchema.safeParse(req.body);
  if (!validationResult.success) {
			return res.status(400).json({ error: 'Invalid appointment data' });
  }

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
  } = validationResult.data;
  const appointmentService = new AppointmentService(req.supabase);
  const { data: appointment, error: appointmentError } = await appointmentService.createAppointment({
    patient_id,
    provider_id,
    type,
    start_time,
    end_time,
    duration,
    notes,
    resources,
    reminders
  }, req.user?.id);

  if (appointmentError) {
    return res.status(500).json({ error: appointmentError.message });
  }

  return res.status(201).json(appointment);
}));

// Update appointment
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = updateAppointmentSchema.safeParse(req.body);
	if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid appointment data' });
  }

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
  } = validationResult.data;
  const appointmentService = new AppointmentService(req.supabase);
	const { data: appointment, error: appointmentError } = await appointmentService.updateAppointment(id, {
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
  });

  if (appointmentError) {
			return res.status(500).json({ error: appointmentError.message });
  }

	return res.json(appointment);
}));

// Cancel appointment
router.post('/:id/cancel', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const validationResult = appointmentIdSchema.safeParse(req.params);
		const cancelValidationResult = cancelAppointmentSchema.safeParse(req.body);
		if (!validationResult.success) {
				return res.status(400).json({ error: 'Invalid appointment ID' });
		}
		if (!cancelValidationResult.success) {
				return res.status(400).json({ error: 'Invalid cancel data' });
		}

		const { id } = validationResult.data;
		const { reason } = cancelValidationResult.data;
		const appointmentService = new AppointmentService(req.supabase);
		const { data: appointment, error } = await appointmentService.cancelAppointment(id, reason, req.user?.id);

		if (error) {
				return res.status(500).json({ error: error.message });
		}

		return res.json(appointment);
}));

// Add comment to appointment
router.post('/:id/comments', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const validationResult = appointmentIdSchema.safeParse(req.params);
		const commentValidationResult = addCommentSchema.safeParse(req.body);
		if (!validationResult.success) {
				return res.status(400).json({ error: 'Invalid appointment ID' });
		}
		if (!commentValidationResult.success) {
				return res.status(400).json({ error: 'Invalid comment data' });
		}

		const { id } = validationResult.data;
		const { content } = commentValidationResult.data;
		const appointmentService = new AppointmentService(req.supabase);
		const { data: comment, error } = await appointmentService.addCommentToAppointment(id, content, req.user?.id);

		if (error) {
				return res.status(500).json({ error: error.message });
		}

		return res.status(201).json(comment);
}));

export default router;