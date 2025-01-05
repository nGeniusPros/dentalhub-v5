import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { PatientService } from '../services/patientService';

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

const createPatientSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  date_of_birth: z.string().min(1),
  address: z.string().min(1),
  medical_history: z.string().optional(),
});

const updatePatientSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  date_of_birth: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  medical_history: z.string().optional(),
});

const patientIdSchema = z.object({
  id: z.string().min(1),
});

const addFamilyMemberSchema = z.object({
  related_patient_id: z.string().min(1),
  relationship_type: z.string().min(1),
});

const uploadDocumentSchema = z.object({
  file: z.any(),
  type: z.string().min(1),
  description: z.string().optional(),
});

const updateMedicalHistorySchema = z.object({
  medical_history: z.string().min(1),
});

const createTreatmentPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  procedures: z.array(z.string()),
  estimated_cost: z.number().min(0),
  duration: z.number().min(0),
});

// Get patient profile
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: patient, error } = await patientService.getPatient(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(patient);
}));

// Create patient
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = createPatientSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient data' });
  }

  const { first_name, last_name, email, phone, date_of_birth, address, medical_history } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: patient, error } = await patientService.createPatient({
    firstName: first_name,
    lastName: last_name,
    email,
    phone,
    dateOfBirth: date_of_birth,
    address,
    medicalHistory: medical_history
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(patient);
}));

// Update patient
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = updatePatientSchema.safeParse(req.body);
  const idValidationResult = patientIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient data' });
  }
  if (!idValidationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = idValidationResult.data;
  const { first_name, last_name, email, phone, date_of_birth, address, medical_history } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: patient, error } = await patientService.updatePatient(id, {
    firstName: first_name,
    lastName: last_name,
    email,
    phone,
    dateOfBirth: date_of_birth,
    address,
    medicalHistory: medical_history
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(patient);
}));

// Delete patient
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { error } = await patientService.deletePatient(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

// Get patient family members
router.get('/:id/family', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: familyMembers, error } = await patientService.getPatientFamilyMembers(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(familyMembers);
}));

// Add family member
router.post('/:id/family', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  const familyValidationResult = addFamilyMemberSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }
  if (!familyValidationResult.success) {
    return res.status(400).json({ error: 'Invalid family member data' });
  }

  const { id } = validationResult.data;
  const { related_patient_id, relationship_type } = familyValidationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: relationship, error } = await patientService.addFamilyMember(id, {
    related_patient_id,
    relationship_type
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(relationship);
}));

// Upload patient document
router.post('/:id/documents', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  const documentValidationResult = uploadDocumentSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }
  if (!documentValidationResult.success) {
    return res.status(400).json({ error: 'Invalid document data' });
  }

  const { id } = validationResult.data;
  const { file, type, description } = documentValidationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: document, error } = await patientService.uploadPatientDocument(id, file, type, description);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(document);
}));

// Get patient documents
router.get('/:id/documents', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: documents, error } = await patientService.getPatientDocuments(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(documents);
}));

// Update patient medical history
router.put('/:id/medical-history', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  const medicalHistoryValidationResult = updateMedicalHistorySchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }
  if (!medicalHistoryValidationResult.success) {
    return res.status(400).json({ error: 'Invalid medical history data' });
  }

  const { id } = validationResult.data;
  const { medical_history } = medicalHistoryValidationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: patient, error } = await patientService.updatePatientMedicalHistory(id, medical_history ?? '');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(patient);
}));

// Create treatment plan
router.post('/:id/treatment-plans', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  const treatmentPlanValidationResult = createTreatmentPlanSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }
  if (!treatmentPlanValidationResult.success) {
    return res.status(400).json({ error: 'Invalid treatment plan data' });
  }

  const { id } = validationResult.data;
  const { title, description, procedures, estimated_cost, duration } = treatmentPlanValidationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: treatmentPlan, error } = await patientService.createTreatmentPlan(id, {
    title,
    description,
    procedures,
    estimated_cost: estimated_cost ?? 0,
    duration: duration ?? 0
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(treatmentPlan);
}));

// Get patient treatment plans
router.get('/:id/treatment-plans', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = patientIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = validationResult.data;
  const patientService = new PatientService(req.supabase);
  const { data: treatmentPlans, error } = await patientService.getPatientTreatmentPlans(id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(treatmentPlans);
}));

export default router;