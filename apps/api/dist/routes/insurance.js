import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
const router = Router();
const verifyInsuranceSchema = z.object({
    patient_id: z.string().min(1),
    provider_id: z.string().min(1),
    policy_number: z.string().min(1),
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
router.get('/providers', asyncHandler(async (req, res) => {
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
router.get('/patients/:id', asyncHandler(async (req, res) => {
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
router.post('/verify', asyncHandler(async (req, res) => {
    const validationResult = verifyInsuranceSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid insurance verification data' });
    }
    const { patient_id, provider_id, policy_number } = validationResult.data;
    // This would integrate with Sikka's API for real verification
    // For now, we'll simulate a verification response
    const verificationResult = {
        status: 'verified',
        coverage: {
            active: true,
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            benefits: {
                preventive: { coverage: 100, deductible: 0 },
                basic: { coverage: 80, deductible: 50 },
                major: { coverage: 50, deductible: 100 }
            }
        }
    };
    // Update patient insurance record
    const { data: insurance, error } = await req.supabase
        .from('patient_insurance')
        .update({
        verification_status: verificationResult.status,
        last_verified_at: new Date().toISOString(),
        benefits_summary: verificationResult.coverage
    })
        .eq('patient_id', patient_id)
        .eq('provider_id', provider_id)
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
}));
// Submit insurance claim
router.post('/claims', asyncHandler(async (req, res) => {
    const validationResult = submitClaimSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid claim data' });
    }
    const { patient_id, provider_id, appointment_id, total_amount, diagnosis_codes, procedure_codes, attachments } = validationResult.data;
    // This would integrate with Sikka's API for real claim submission
    // For now, we'll simulate a claim submission
    const claimNumber = `CLM${Date.now()}`;
    const { data: claim, error } = await req.supabase
        .from('insurance_claims')
        .insert({
        patient_id,
        provider_id,
        appointment_id,
        claim_number: claimNumber,
        status: 'submitted',
        submission_date: new Date().toISOString(),
        service_date: new Date().toISOString(),
        total_amount,
        diagnosis_codes,
        procedure_codes,
        attachments,
        created_by: req.user?.id
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
    // Record claim history
    await req.supabase
        .from('claim_history')
        .insert({
        claim_id: claim?.id || null,
        status: 'submitted',
        notes: 'Claim submitted successfully',
        created_by: req.user?.id
    });
    return res.status(201).json(claim);
}));
// Update claim status
router.put('/claims/:id/status', asyncHandler(async (req, res) => {
    const validationResult = claimStatusSchema.safeParse(req.body);
    const idValidationResult = insuranceIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid claim status data' });
    }
    if (!idValidationResult.success) {
        return res.status(400).json({ error: 'Invalid claim ID' });
    }
    const { id } = idValidationResult.data;
    const { status, notes, response_details } = validationResult.data;
    const { data: claim, error } = await req.supabase
        .from('insurance_claims')
        .update({
        status,
        response_details
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
    // Record claim history
    await req.supabase
        .from('claim_history')
        .insert({
        claim_id: id,
        status,
        notes,
        created_by: req.user?.id
    });
    return res.json(claim);
}));
// Get claim history
router.get('/claims/:id/history', asyncHandler(async (req, res) => {
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
router.get('/claims/analytics/summary', asyncHandler(async (req, res) => {
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
        by_status: {}
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
export default router;
