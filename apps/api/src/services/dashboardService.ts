import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { ErrorCode, ErrorResponse } from "../errors";
import { logger } from "../lib/logger";
import { DashboardStats } from "../types/dashboard";
import { validateUUID } from "../utils/validators.ts";

export class DashboardService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getStats(userId: string, startDate?: string, endDate?: string) {
    try {
      // Validate user input
      if (!validateUUID(userId)) {
        throw new ErrorResponse({
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid user ID format",
        });
      }

      // Verify user existence
      const {
        data: { user },
        error,
      } = await this.supabase.auth.admin.getUserById(userId);

      if (error || !user) {
        throw new ErrorResponse({
          code: ErrorCode.NOT_FOUND,
          message: "User not found in database",
        });
      }

      // Return mock data with proper typing
      return {
        monthlyRevenue: {
          value: 145678,
          change: 8,
        },
        patientGrowth: {
          value: 3456,
          change: 12,
        },
        treatmentAcceptance: {
          value: 78,
          change: 5,
        },
        appointmentFillRate: {
          value: 92,
          change: 3,
        },
        insuranceClaims: {
          value: 245,
          change: 7,
        },
        averageWaitTime: {
          value: 12,
          change: -4,
        },
        patientSatisfaction: {
          value: 4.8,
          change: 2,
        },
        staffProductivity: {
          value: 94,
          change: 6,
        },
      } satisfies DashboardStats;
    } catch (error) {
      logger.error("Dashboard service failure:", error);

      if (error instanceof ErrorResponse) {
        throw error; // Preserve business logic errors
      }

      throw new ErrorResponse({
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to load dashboard data",
        originalError: error,
      });
    }
  }

  async getRevenueAnalytics(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      return {
        monthlyRevenue: {
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          revenue: [120000, 125000, 128000, 130000, 127000, 132000],
          expenses: [85000, 88000, 90000, 92000, 89000, 91000],
          profit: [35000, 37000, 38000, 38000, 38000, 41000],
        },
        revenueByService: [
          { service: "General Dentistry", value: 45, color: "#40E0D0" },
          { service: "Orthodontics", value: 25, color: "#8B5CF6" },
          { service: "Cosmetic", value: 20, color: "#DEB887" },
          { service: "Implants", value: 10, color: "#1E40AF" },
        ],
      };
    } catch (error) {
      console.error("Error in getRevenueAnalytics:", error);
      throw error;
    }
  }

  async getPatientMetrics(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      return {
        patientGrowth: {
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [45, 52, 49, 55, 59, 65],
        },
        demographics: [
          { ageGroup: "18-30", percentage: 25 },
          { ageGroup: "31-50", percentage: 45 },
          { ageGroup: "51-70", percentage: 20 },
          { ageGroup: "70+", percentage: 10 },
        ],
      };
    } catch (error) {
      console.error("Error in getPatientMetrics:", error);
      throw error;
    }
  }

  async getStaffMetrics(userId: string, startDate?: string, endDate?: string) {
    try {
      return [
        {
          id: "1",
          name: "Dr. Sarah Wilson",
          role: "Dentist",
          metrics: {
            appointmentsCompleted: 145,
            patientSatisfaction: 98,
            revenue: 52000,
          },
        },
        {
          id: "2",
          name: "Dr. James Chen",
          role: "Dentist",
          metrics: {
            appointmentsCompleted: 138,
            patientSatisfaction: 96,
            revenue: 48000,
          },
        },
        {
          id: "3",
          name: "Emma Thompson",
          role: "Hygienist",
          metrics: {
            appointmentsCompleted: 156,
            patientSatisfaction: 95,
            revenue: 31000,
          },
        },
        {
          id: "4",
          name: "Michael Brown",
          role: "Dental Assistant",
          metrics: {
            appointmentsCompleted: 142,
            patientSatisfaction: 94,
            revenue: 28000,
          },
        },
      ];
    } catch (error) {
      console.error("Error in getStaffMetrics:", error);
      throw error;
    }
  }
}
