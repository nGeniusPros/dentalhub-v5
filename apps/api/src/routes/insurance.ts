import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { z } from 'zod';

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

import {
  verifyInsurance,
  processClaim,
  updateClaimStatus,
  getInsurancePlanCoverage,
  getInsuranceCompanies
} from '../integrations/sikka/service';

const verifyInsuranceSchema = z.object({
  patient_id: z.string().min(1),
  insurance_info: z.object({
    carrier_id: z.string().min(1),
    member_id: z.string().min(1),
    group_number: z.string().optional(),
  }),
});

const submitClaimSchema = z.object({
  patient_id: z.string().min(1),
  provider_id: z.string().min(1),
  appointment_id: z.string().min(1),
  total_amount: z.number().min(0),
  diagnosis_codes: z.array(z.string()),
  procedure_codes: z.array(z.string()),
  attachments: z.array(z.string()).optional(),
});

const insuranceIdSchema = z.object({
  id: z.string().min(1),
});

const claimStatusSchema = z.object({
  status: z.string().min(1),
  notes: z.string().optional(),
  response_details: z.any().optional(),
});

const claimsAnalyticsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

const getProvidersSchema = z.object({
  active: z.string().optional(),
});

// Get all insurance providers
router.get('/providers', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = getProvidersSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { active } = validationResult.data;

  let query = req.supabase
    .from('insurance_providers')
    .select('*');

  if (active !== undefined) {
    query = query.eq('active', active === 'true');
  }

  const { data: providers, error } = await query.order('name', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(providers);
}));

// Get patient insurance information
router.get('/patients/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = insuranceIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const { id } = validationResult.data;

  const { data: insurance, error } = await req.supabase
    .from('patient_insurance')
    .select(`
      *,
      provider:insurance_providers(*)
    `)
    .eq('patient_id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(insurance);
}));

// Verify insurance coverage
router.post('/verify', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = verifyInsuranceSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid insurance verification data' });
  }

  const { patient_id, insurance_info } = validationResult.data;

  try {
    const verificationResult = await verifyInsurance({
      patientId: patient_id,
      insuranceInfo: {
        carrierId: insurance_info.carrier_id,
        memberId: insurance_info.member_id,
        groupNumber: insurance_info.group_number,
      },
    });

    // Update patient insurance record
    const { data: insurance, error } = await req.supabase
      .from('patient_insurance')
      .update({
        verification_status: verificationResult.verified ? 'verified' : 'unverified',
        last_verified_at: verificationResult.timestamp,
        benefits_summary: verificationResult.details
      })
      .eq('patient_id', patient_id)
      .select(`
        *,
        provider:insurance_providers(*)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      verification: verificationResult,
      insurance
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}));

// Submit insurance claim
router.post('/claims', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = submitClaimSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid claim data' });
  }

  const {
    patient_id,
    provider_id,
    appointment_id,
    total_amount,
    diagnosis_codes,
    procedure_codes,
    attachments
  } = validationResult.data;

  try {
    // Submit claim through Sikka API
    const sikkaResponse = await processClaim({
      patientId: patient_id,
      claimDetails: {
        serviceDate: new Date().toISOString(),
        procedures: procedure_codes.map((code, index) => ({
          code,
          fee: total_amount / procedure_codes.length, // Distribute total amount across procedures
          diagnosis: [diagnosis_codes[index] || diagnosis_codes[0]], // Map diagnosis codes to procedures
        })),
        diagnosisCodes: diagnosis_codes,
        placeOfService: 'office', // Default to office, could be made configurable
      },
    });

    // Store claim in database with Sikka response
    const { data: claim, error } = await req.supabase
      .from('insurance_claims')
      .insert({
        patient_id,
        provider_id,
        appointment_id,
        claim_number: sikkaResponse.claimId,
        status: sikkaResponse.status,
        submission_date: sikkaResponse.timestamp,
        service_date: new Date().toISOString(),
        total_amount,
        diagnosis_codes,
        procedure_codes,
        attachments,
        created_by: req.user?.id,
        sikka_acknowledgement: sikkaResponse.acknowledgement
      })
      .select(`
        *,
        provider:insurance_providers(*),
        patient:users(*)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Record claim history with Sikka details
    await req.supabase
      .from('claim_history')
      .insert({
        claim_id: claim?.id || null,
        status: sikkaResponse.status,
        notes: `Claim submitted successfully. Sikka Claim ID: ${sikkaResponse.claimId}`,
        created_by: req.user?.id,
        response_details: sikkaResponse
      });

    return res.status(201).json({
      claim,
      sikka_response: sikkaResponse
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'An unexpected error occurred while submitting the claim' });
  }
}));

// Update claim status
router.put('/claims/:id/status', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = claimStatusSchema.safeParse(req.body);
  const idValidationResult = insuranceIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid claim status data' });
  }
  if (!idValidationResult.success) {
    return res.status(400).json({ error: 'Invalid claim ID' });
  }

  try {
    const { id } = idValidationResult.data;
    const { status, notes, response_details } = validationResult.data;

    // First, get the existing claim to get the Sikka claim ID
    const { data: existingClaim, error: fetchError } = await req.supabase
      .from('insurance_claims')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingClaim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Update status in Sikka
    const sikkaResponse = await updateClaimStatus({
      claimId: existingClaim.claim_number,
      status,
      notes,
    });

    // Update claim in database with Sikka response
    const { data: claim, error } = await req.supabase
      .from('insurance_claims')
      .update({
        status: sikkaResponse.status,
        response_details: {
          ...response_details,
          sikka_acknowledgement: sikkaResponse.acknowledgement,
          sikka_timestamp: sikkaResponse.timestamp
        }
      })
      .eq('id', id)
      .select(`
        *,
        provider:insurance_providers(*),
        patient:auth.users(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Record claim history with Sikka details
    await req.supabase
      .from('claim_history')
      .insert({
        claim_id: id,
        status: sikkaResponse.status,
        notes: notes || `Status updated to: ${sikkaResponse.status}`,
        created_by: req.user?.id,
        response_details: {
          sikka_response: sikkaResponse
        }
      });

    return res.json({
      claim,
      sikka_response: sikkaResponse
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'An unexpected error occurred while updating claim status' });
  }
}));

// Get claim history
router.get('/claims/:id/history', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = insuranceIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid claim ID' });
  }

  const { id } = validationResult.data;

  const { data: history, error } = await req.supabase
    .from('claim_history')
    .select(`
      *,
      created_by_user:auth.users!created_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
    .eq('claim_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(history);
}));

// Get claims analytics
router.get('/claims/analytics/summary', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const validationResult = claimsAnalyticsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid analytics parameters' });
  }

  const { start_date, end_date } = validationResult.data;

  // Get claims within date range
  const { data: claims, error } = await req.supabase
    .from('insurance_claims')
    .select('status, total_amount, covered_amount, patient_responsibility')
    .gte('submission_date', start_date)
    .lte('submission_date', end_date);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Calculate summary statistics
  const summary = {
    total_claims: claims?.length || 0,
    total_amount: 0,
    total_covered: 0,
    total_patient_responsibility: 0,
    by_status: {} as Record<string, { count: number; amount: number }>
  };

  claims?.forEach(claim => {
    summary.total_amount += claim.total_amount;
    summary.total_covered += claim.covered_amount || 0;
    summary.total_patient_responsibility += claim.patient_responsibility || 0;

    if (!summary.by_status[claim.status]) {
      summary.by_status[claim.status] = { count: 0, amount: 0 };
    }
    summary.by_status[claim.status].count += 1;
    summary.by_status[claim.status].amount += claim.total_amount;
  });

  return res.json(summary);
}));

// Get fee schedules
router.get('/fee-schedules', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: feeSchedules, error } = await req.supabase
      .from('fee_schedules')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(feeSchedules);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'An unexpected error occurred' });
  }
}));

// Get insurance plan coverage
router.get('/plan-coverage/:insurance_company_id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { insurance_company_id } = req.params;
    const { practice_id } = req.query;

    const coverage = await getInsurancePlanCoverage(
      insurance_company_id,
      practice_id as string | undefined
    );

    return res.json(coverage);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'An unexpected error occurred' });
  }
}));

// Get insurance companies
router.get('/companies', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const companies = await getInsuranceCompanies({
      practice_id: req.query.practice_id as string | undefined
    });

    return res.json(companies);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'An unexpected error occurred' });
  }
}));

export default router;