import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Get patient profile
router.get('/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { data: patient, error } = await req.supabase
    .from('patients')
    .select(`
      *,
      appointments (
        id,
        appointment_date,
        type,
        status
      ),
      reports (
        id,
        type,
        status,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(patient);
}));

// Create patient
router.post('/', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { first_name, last_name, email, phone, date_of_birth, address, medical_history } = req.body;
  
  const { data: patient, error } = await req.supabase
    .from('patients')
    .insert({
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      medical_history
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(patient);
}));

// Update patient
router.put('/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, date_of_birth, address, medical_history } = req.body;

  const { data: patient, error } = await req.supabase
    .from('patients')
    .update({
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      medical_history
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(patient);
}));

// Delete patient
router.delete('/:id', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).send();
}));

// Get patient family members
router.get('/:id/family', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { data: familyMembers, error } = await req.supabase
    .from('family_relationships')
    .select(`
      related_patient:patients!related_patient_id (
        id,
        first_name,
        last_name,
        appointments (
          id,
          appointment_date,
          type,
          status
        )
      ),
      relationship_type
    `)
    .eq('patient_id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(familyMembers);
}));

// Add family member
router.post('/:id/family', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { related_patient_id, relationship_type } = req.body;

  const { data: relationship, error } = await req.supabase
    .from('family_relationships')
    .insert({
      patient_id: id,
      related_patient_id,
      relationship_type
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(relationship);
}));

// Upload patient document
router.post('/:id/documents', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { file, type, description } = req.body;

  // Upload file to Supabase Storage
  const { data: fileData, error: uploadError } = await req.supabase
    .storage
    .from('patient-documents')
    .upload(`${id}/${file.name}`, file);

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message });
  }

  // Create document record
  const { data: document, error: documentError } = await req.supabase
    .from('patient_documents')
    .insert({
      patient_id: id,
      file_path: fileData.path,
      type,
      description
    })
    .select()
    .single();

  if (documentError) {
    return res.status(500).json({ error: documentError.message });
  }

  return res.status(201).json(document);
}));

// Get patient documents
router.get('/:id/documents', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { data: documents, error } = await req.supabase
    .from('patient_documents')
    .select('*')
    .eq('patient_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(documents);
}));

// Update patient medical history
router.put('/:id/medical-history', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { medical_history } = req.body;

  const { data: patient, error } = await req.supabase
    .from('patients')
    .update({ medical_history })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(patient);
}));

// Create treatment plan
router.post('/:id/treatment-plans', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { title, description, procedures, estimated_cost, duration } = req.body;

  const { data: treatmentPlan, error } = await req.supabase
    .from('treatment_plans')
    .insert({
      patient_id: id,
      title,
      description,
      procedures,
      estimated_cost,
      duration
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(treatmentPlan);
}));

// Get patient treatment plans
router.get('/:id/treatment-plans', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  const { id } = req.params;
  const { data: treatmentPlans, error } = await req.supabase
    .from('treatment_plans')
    .select('*')
    .eq('patient_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(treatmentPlans);
}));

export default router;