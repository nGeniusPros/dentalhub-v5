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

// Get all payments
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, method, start_date, end_date } = req.query;
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
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

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
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    patient_id,
    appointment_id,
    amount,
    method,
    reference_number,
    notes,
    metadata
  } = req.body;

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
router.put('/:id/status', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

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
router.post('/:id/refund', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

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
router.get('/analytics/summary', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { start_date, end_date } = req.query;

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
    by_method: {} as Record<string, { amount: number; count: number }>,
    by_status: {} as Record<string, { amount: number; count: number }>,
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