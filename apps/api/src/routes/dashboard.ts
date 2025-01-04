import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Get all dashboard stats in a single request
router.get('/stats', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
		const { supabase } = req;

		// Get total patients count and change
		const { data: currentPatients, error: patientsError } = await supabase
    .from('patients')
				.select('id', { count: 'exact' });

		const { data: lastMonthPatients } = await supabase
				.from('patients')
    .select('id', { count: 'exact' })
				.lt('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

		const patientsChange = lastMonthPatients ?
				((currentPatients?.length || 0) - lastMonthPatients.length) / lastMonthPatients.length * 100 : 0;

		// Get today's appointments
		const today = new Date().toISOString().split('T')[0];
		const { data: todayAppointments, error: appointmentsError } = await supabase
				.from('appointments')
    .select('id')
				.gte('appointment_date', today)
				.lt('appointment_date', today + 'T23:59:59');

		// Get monthly revenue and change
  const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
		const { data: currentRevenue, error: revenueError } = await supabase
				.from('payments')
				.select('amount')
				.gte('payment_date', currentMonth);

		const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
				.toISOString().split('T')[0].substring(0, 7);
		const { data: lastMonthRevenue } = await supabase
				.from('payments')
				.select('amount')
				.gte('payment_date', lastMonth)
				.lt('payment_date', currentMonth);

		const currentRevenueTotal = currentRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
		const lastRevenueTotal = lastMonthRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
		const revenueChange = lastRevenueTotal ?
				(currentRevenueTotal - lastRevenueTotal) / lastRevenueTotal * 100 : 0;

		// Get pending reports
		const { data: pendingReports, error: reportsError } = await supabase
				.from('reports')
				.select('id')
				.eq('status', 'pending');

		// Get monthly data for charts (last 6 months)
		const monthlyData = [];
		for (let i = 5; i >= 0; i--) {
				const date = new Date();
				date.setMonth(date.getMonth() - i);
				const month = date.toISOString().split('T')[0].substring(0, 7);
				const nextMonth = new Date(date.setMonth(date.getMonth() + 1))
						.toISOString().split('T')[0].substring(0, 7);

				const { data: monthAppointments } = await supabase
						.from('appointments')
						.select('id', { count: 'exact' })
						.gte('appointment_date', month)
						.lt('appointment_date', nextMonth);

				const { data: monthRevenue } = await supabase
						.from('payments')
						.select('amount')
						.gte('payment_date', month)
						.lt('payment_date', nextMonth);

				monthlyData.push({
						month: new Date(date).toLocaleString('default', { month: 'short' }),
						appointments: monthAppointments?.length || 0,
						revenue: monthRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0
				});
		}

		if (patientsError || appointmentsError || revenueError || reportsError) {
				return res.status(500).json({
						error: 'Error fetching dashboard data',
						details: { patientsError, appointmentsError, revenueError, reportsError }
				});
		}

		res.json({
				stats: {
						totalPatients: {
								value: currentPatients?.length || 0,
								change: patientsChange
						},
						todayAppointments: {
								value: todayAppointments?.length || 0
						},
						monthlyRevenue: {
								value: currentRevenueTotal,
								change: revenueChange
						},
						pendingReports: {
								value: pendingReports?.length || 0
						}
				},
				monthlyData
		});
}));

export default router;