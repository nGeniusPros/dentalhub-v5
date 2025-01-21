import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
const router = Router();
const getPaymentsSchema = z.object({
    status: z.string().optional(),
    method: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});
const paymentIdSchema = z.object({
    id: z.string().min(1),
});
const processPaymentSchema = z.object({
    patient_id: z.string().min(1),
    appointment_id: z.string().optional(),
    amount: z.number().min(0),
    method: z.string().min(1),
    reference_number: z.string().optional(),
    notes: z.string().optional(),
    metadata: z.any().optional(),
});
const updatePaymentStatusSchema = z.object({
    status: z.string().min(1),
    notes: z.string().optional(),
});
const refundPaymentSchema = z.object({
    amount: z.number().min(0),
    reason: z.string().min(1),
});
const paymentAnalyticsSchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});
// Get all payments
router.get('/', asyncHandler(async (req, res) => {
    const validationResult = getPaymentsSchema.safeParse(req.query);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const { status, method, start_date, end_date } = validationResult.data;
    let query = req.supabase
        .from('payments')
        .select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      ),
      created_by_user:auth.users!created_by(
        id,
        email,
        raw_user_meta_data
      )
    `);
    if (status) {
        query = query.eq('status', status);
    }
    if (method) {
        query = query.eq('method', method);
    }
    if (start_date) {
        query = query.gte('payment_date', start_date);
    }
    if (end_date) {
        query = query.lte('payment_date', end_date);
    }
    const { data: payments, error } = await query.order('created_at', { ascending: false });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(payments);
}));
// Get payment by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const validationResult = paymentIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid payment ID' });
    }
    const { id } = validationResult.data;
    const { data: payment, error } = await req.supabase
        .from('payments')
        .select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      ),
      created_by_user:auth.users!created_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
        .eq('id', id)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(payment);
}));
// Process new payment
router.post('/', asyncHandler(async (req, res) => {
    const validationResult = processPaymentSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid payment data' });
    }
    const { patient_id, appointment_id, amount, method, reference_number, notes, metadata } = validationResult.data;
    // Process payment through payment gateway
    // This is a placeholder for actual payment processing logic
    const paymentResult = {
        success: true,
        transaction_id: `txn_${Date.now()}`,
        status: 'completed'
    };
    if (!paymentResult.success) {
        return res.status(400).json({ error: 'Payment processing failed' });
    }
    // Record payment in database
    const { data: payment, error } = await req.supabase
        .from('payments')
        .insert({
        patient_id,
        appointment_id,
        amount,
        method,
        status: paymentResult.status,
        transaction_id: paymentResult.transaction_id,
        reference_number,
        payment_date: new Date().toISOString(),
        notes,
        metadata,
        created_by: req.user?.id
    })
        .select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      ),
      created_by_user:auth.users!created_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    // If payment is for an appointment, update appointment payment status
    if (appointment_id) {
        await req.supabase
            .from('appointments')
            .update({ payment_status: 'paid' })
            .eq('id', appointment_id);
    }
    return res.status(201).json(payment);
}));
// Update payment status
router.put('/:id/status', asyncHandler(async (req, res) => {
    const validationResult = paymentIdSchema.safeParse(req.params);
    const statusValidationResult = updatePaymentStatusSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid payment ID' });
    }
    if (!statusValidationResult.success) {
        return res.status(400).json({ error: 'Invalid payment status data' });
    }
    const { id } = validationResult.data;
    const { status, notes } = statusValidationResult.data;
    const { data: payment, error } = await req.supabase
        .from('payments')
        .update({
        status,
        notes: notes ? `${notes}\n${new Date().toISOString()}: Status updated to ${status}` : null
    })
        .eq('id', id)
        .select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      ),
      created_by_user:auth.users!created_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(payment);
}));
// Process refund
router.post('/:id/refund', asyncHandler(async (req, res) => {
    const validationResult = paymentIdSchema.safeParse(req.params);
    const refundValidationResult = refundPaymentSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid payment ID' });
    }
    if (!refundValidationResult.success) {
        return res.status(400).json({ error: 'Invalid refund data' });
    }
    const { id } = validationResult.data;
    const { amount, reason } = refundValidationResult.data;
    // Get original payment
    const { data: originalPayment, error: fetchError } = await req.supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();
    if (fetchError || !originalPayment) {
        return res.status(404).json({ error: 'Payment not found' });
    }
    // Process refund through payment gateway
    // This is a placeholder for actual refund processing logic
    const refundResult = {
        success: true,
        transaction_id: `rfnd_${Date.now()}`,
        status: 'completed'
    };
    if (!refundResult.success) {
        return res.status(400).json({ error: 'Refund processing failed' });
    }
    // Record refund in database
    const { data: refund, error } = await req.supabase
        .from('payments')
        .insert({
        patient_id: originalPayment.patient_id,
        appointment_id: originalPayment.appointment_id,
        amount: -Math.abs(amount),
        method: originalPayment.method,
        status: 'completed',
        transaction_id: refundResult.transaction_id,
        reference_number: `REFUND-${originalPayment.transaction_id}`,
        payment_date: new Date().toISOString(),
        notes: `Refund for payment ${originalPayment.transaction_id}. Reason: ${reason}`,
        metadata: {
            original_payment_id: id,
            refund_reason: reason
        },
        created_by: req.user?.id
    })
        .select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      ),
      created_by_user:auth.users!created_by(
        id,
        email,
        raw_user_meta_data
      )
    `)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    // Update original payment status
    await req.supabase
        .from('payments')
        .update({
        status: 'refunded',
        notes: `${originalPayment.notes || ''}\n${new Date().toISOString()}: Refunded ${amount}. Reason: ${reason}`
    })
        .eq('id', id);
    return res.status(201).json(refund);
}));
// Get payment analytics
router.get('/analytics/summary', asyncHandler(async (req, res) => {
    const validationResult = paymentAnalyticsSchema.safeParse(req.query);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid analytics parameters' });
    }
    const { start_date, end_date } = validationResult.data;
    // Get total payments
    const { data: payments, error: paymentsError } = await req.supabase
        .from('payments')
        .select('amount, method, status, payment_date')
        .gte('payment_date', start_date)
        .lte('payment_date', end_date);
    if (paymentsError) {
        return res.status(500).json({ error: paymentsError.message });
    }
    // Calculate summary statistics
    const summary = {
        total_amount: 0,
        count: 0,
        by_method: {},
        by_status: {},
    };
    payments?.forEach(payment => {
        summary.total_amount += payment.amount;
        summary.count += 1;
        // Group by payment method
        if (!summary.by_method[payment.method]) {
            summary.by_method[payment.method] = { amount: 0, count: 0 };
        }
        summary.by_method[payment.method].amount += payment.amount;
        summary.by_method[payment.method].count += 1;
        // Group by status
        if (!summary.by_status[payment.status]) {
            summary.by_status[payment.status] = { amount: 0, count: 0 };
        }
        summary.by_status[payment.status].amount += payment.amount;
        summary.by_status[payment.status].count += 1;
    });
    return res.json(summary);
}));
export default router;
