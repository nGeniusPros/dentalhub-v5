import { Router, Response } from 'express';
import { SupabaseRequest } from '../types/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { errorHandler } from '../middleware/errorHandler';

const router: Router = Router();

const dashboardStatsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// Get all dashboard stats in a single request
router.get('/stats', asyncHandler(async (req: SupabaseRequest, res: Response) => {
  try {
    res.json({
      monthlyRevenue: {
        value: 145678,
        change: 8
      },
      patientGrowth: {
        value: 3456,
        change: 12
      },
      treatmentAcceptance: {
        value: 78,
        change: 5
      },
      appointmentFillRate: {
        value: 92,
        change: 3
      },
      insuranceClaims: {
        value: 245,
        change: 7
      },
      averageWaitTime: {
        value: 12,
        change: -4
      },
      patientSatisfaction: {
        value: 4.8,
        change: 2
      },
      staffProductivity: {
        value: 94,
        change: 6
      }
    });
  } catch (error) {
    console.error('Error in dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/revenue-analytics', asyncHandler(async (req: SupabaseRequest, res: Response) => {
  try {
    res.json({
      monthlyRevenue: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenue: [120000, 125000, 128000, 130000, 127000, 132000],
        expenses: [85000, 88000, 90000, 92000, 89000, 91000],
        profit: [35000, 37000, 38000, 38000, 38000, 41000]
      },
      revenueByService: [
        { service: 'General Dentistry', value: 45, color: '#40E0D0' },
        { service: 'Orthodontics', value: 25, color: '#8B5CF6' },
        { service: 'Cosmetic', value: 20, color: '#DEB887' },
        { service: 'Implants', value: 10, color: '#1E40AF' }
      ]
    });
  } catch (error) {
    console.error('Error in revenue analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/staff-metrics', asyncHandler(async (req: SupabaseRequest, res: Response) => {
  try {
    // Return mock data matching the StaffMetrics type
    res.json([
      {
        id: '1',
        name: 'Dr. Sarah Wilson',
        role: 'Dentist',
        metrics: {
          appointmentsCompleted: 145,
          patientSatisfaction: 98,
          revenue: 52000
        }
      },
      {
        id: '2',
        name: 'Dr. James Chen',
        role: 'Dentist',
        metrics: {
          appointmentsCompleted: 138,
          patientSatisfaction: 96,
          revenue: 48000
        }
      },
      {
        id: '3',
        name: 'Emma Thompson',
        role: 'Hygienist',
        metrics: {
          appointmentsCompleted: 156,
          patientSatisfaction: 95,
          revenue: 31000
        }
      },
      {
        id: '4',
        name: 'Michael Brown',
        role: 'Dental Assistant',
        metrics: {
          appointmentsCompleted: 142,
          patientSatisfaction: 94,
          revenue: 28000
        }
      }
    ]);
  } catch (error) {
    console.error('Error in staff metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/patient-metrics', asyncHandler(async (req: SupabaseRequest, res: Response) => {
  try {
    res.json({
      patientGrowth: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [45, 52, 49, 55, 59, 65]
      },
      demographics: [
        { ageGroup: '18-30', percentage: 25 },
        { ageGroup: '31-50', percentage: 45 },
        { ageGroup: '51-70', percentage: 20 },
        { ageGroup: '70+', percentage: 10 }
      ]
    });
  } catch (error) {
    console.error('Error in patient metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/marketing-metrics', asyncHandler(async (req: SupabaseRequest, res: Response) => {
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
  } catch (error) {
    console.error('Error in marketing metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/treatment-analytics', asyncHandler(async (req: SupabaseRequest, res: Response) => {
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
  } catch (error) {
    console.error('Error in treatment analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/appointment-overview', asyncHandler(async (req: SupabaseRequest, res: Response) => {
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
  } catch (error) {
    console.error('Error in appointment overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

router.get('/hygiene-analytics', asyncHandler(async (req: SupabaseRequest, res: Response) => {
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
  } catch (error) {
    console.error('Error in hygiene analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

export default router;