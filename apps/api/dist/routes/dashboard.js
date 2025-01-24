import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { DashboardService } from '../services/dashboardService';
import { ErrorCode } from '../types/errors';
const router = Router();
// Apply authentication middleware to all dashboard routes
router.use(requireAuth);
const dashboardStatsSchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});
// Get all dashboard stats in a single request
router.get('/stats', asyncHandler(async (req, res) => {
    try {
        const { start_date, end_date } = dashboardStatsSchema.parse(req.query);
        const dashboardService = new DashboardService(req.supabase);
        const stats = await dashboardService.getStats(req.user.id, start_date, end_date);
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard statistics',
            code: ErrorCode.INTERNAL_ERROR,
            details: error instanceof Error ? error.message : undefined
        });
    }
}));
router.get('/revenue-analytics', asyncHandler(async (req, res) => {
    try {
        const { start_date, end_date } = dashboardStatsSchema.parse(req.query);
        const dashboardService = new DashboardService(req.supabase);
        const revenue = await dashboardService.getRevenueAnalytics(req.user.id, start_date, end_date);
        res.json(revenue);
    }
    catch (error) {
        console.error('Error fetching revenue analytics:', error);
        res.status(500).json({
            error: 'Failed to fetch revenue analytics',
            code: ErrorCode.INTERNAL_ERROR,
            details: error instanceof Error ? error.message : undefined
        });
    }
}));
router.get('/staff-metrics', asyncHandler(async (req, res) => {
    try {
        const { start_date, end_date } = dashboardStatsSchema.parse(req.query);
        const dashboardService = new DashboardService(req.supabase);
        const metrics = await dashboardService.getStaffMetrics(req.user.id, start_date, end_date);
        res.json(metrics);
    }
    catch (error) {
        console.error('Error fetching staff metrics:', error);
        res.status(500).json({
            error: 'Failed to fetch staff metrics',
            code: ErrorCode.INTERNAL_ERROR,
            details: error instanceof Error ? error.message : undefined
        });
    }
}));
router.get('/patient-metrics', asyncHandler(async (req, res) => {
    try {
        const { start_date, end_date } = dashboardStatsSchema.parse(req.query);
        const dashboardService = new DashboardService(req.supabase);
        const metrics = await dashboardService.getPatientMetrics(req.user.id, start_date, end_date);
        res.json(metrics);
    }
    catch (error) {
        console.error('Error fetching patient metrics:', error);
        res.status(500).json({
            error: 'Failed to fetch patient metrics',
            code: ErrorCode.INTERNAL_ERROR,
            details: error instanceof Error ? error.message : undefined
        });
    }
}));
router.get('/marketing-metrics', asyncHandler(async (req, res) => {
    try {
        res.json({
            channelPerformance: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                social: [24, 28, 32, 30, 35, 38],
                referral: [42, 45, 48, 46, 50, 52],
                direct: [34, 32, 35, 38, 36, 40]
            },
            leadSources: [
                { source: 'Social Media', percentage: 30 },
                { source: 'Patient Referrals', percentage: 45 },
                { source: 'Website', percentage: 15 },
                { source: 'Other', percentage: 10 }
            ]
        });
    }
    catch (error) {
        console.error('Error in marketing metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/treatment-analytics', asyncHandler(async (req, res) => {
    try {
        res.json({
            treatmentSuccess: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                success: [92, 94, 93, 95, 94, 96],
                complications: [8, 6, 7, 5, 6, 4]
            },
            popularTreatments: [
                { treatment: 'Cleaning', count: 245 },
                { treatment: 'Fillings', count: 180 },
                { treatment: 'Root Canal', count: 85 },
                { treatment: 'Crowns', count: 65 }
            ]
        });
    }
    catch (error) {
        console.error('Error in treatment analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/appointment-overview', asyncHandler(async (req, res) => {
    try {
        res.json({
            appointmentStats: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                scheduled: [180, 195, 188, 200, 210, 205],
                completed: [165, 180, 175, 190, 195, 190],
                cancelled: [15, 15, 13, 10, 15, 15]
            },
            upcomingAppointments: [
                { patient: 'John Doe', time: '09:00 AM', type: 'Checkup' },
                { patient: 'Jane Smith', time: '10:30 AM', type: 'Cleaning' },
                { patient: 'Mike Johnson', time: '02:00 PM', type: 'Filling' }
            ]
        });
    }
    catch (error) {
        console.error('Error in appointment overview:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/hygiene-analytics', asyncHandler(async (req, res) => {
    try {
        res.json({
            hygieneStats: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                cleanings: [120, 125, 118, 130, 128, 135],
                fluoride: [85, 90, 88, 92, 95, 98],
                sealants: [45, 42, 48, 50, 47, 52]
            },
            patientCompliance: {
                high: 65,
                medium: 25,
                low: 10
            }
        });
    }
    catch (error) {
        console.error('Error in hygiene analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
export { router as dashboardRoutes };
