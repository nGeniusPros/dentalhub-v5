import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
export declare class DashboardService {
    private supabase;
    constructor(supabase: SupabaseClient<Database>);
    getStats(userId: string, startDate?: string, endDate?: string): Promise<DashboardStats>;
    getRevenueAnalytics(userId: string, startDate?: string, endDate?: string): Promise<{
        monthlyRevenue: {
            months: string[];
            revenue: number[];
            expenses: number[];
            profit: number[];
        };
        revenueByService: {
            service: string;
            value: number;
            color: string;
        }[];
    }>;
    getPatientMetrics(userId: string, startDate?: string, endDate?: string): Promise<{
        patientGrowth: {
            months: string[];
            values: number[];
        };
        demographics: {
            ageGroup: string;
            percentage: number;
        }[];
    }>;
    getStaffMetrics(userId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        name: string;
        role: string;
        metrics: {
            appointmentsCompleted: number;
            patientSatisfaction: number;
            revenue: number;
        };
    }[]>;
}
