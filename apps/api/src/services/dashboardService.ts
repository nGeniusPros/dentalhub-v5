import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { ErrorCode, ErrorResponse } from "../errors";
import { logger } from "../lib/logger";
import { DashboardStats, KPIMetrics, AppointmentOverview, RevenueAnalytics } from "../types/dashboard";
import { validateUUID } from "../utils/validators";
import { RealtimeChannel } from "@supabase/supabase-js";

export class DashboardService {
  private realtimeChannels: Map<string, RealtimeChannel> = new Map();

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

      // Get KPI metrics
      const kpiMetrics = await this.getKPIMetrics(userId, startDate, endDate);

      // Return dashboard stats
      return {
        monthlyRevenue: kpiMetrics.monthlyRevenue,
        patientGrowth: kpiMetrics.totalPatients,
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

  async getKPIMetrics(userId: string, startDate?: string, endDate?: string): Promise<KPIMetrics> {
    try {
      if (!validateUUID(userId)) {
        throw new ErrorResponse({
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid user ID format",
        });
      }

      const dateRange = this.getDateRangeQuery(startDate, endDate);

      // Get revenue metrics
      const { data: revenueData, error: revenueError } = await this.supabase
        .from('revenue_entries')
        .select('amount, created_at')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      if (revenueError) throw revenueError;

      // Get patient metrics
      const { data: patientData, error: patientError } = await this.supabase
        .from('patients')
        .select('id, created_at')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      if (patientError) throw patientError;

      // Get appointment metrics
      const { data: appointmentData, error: appointmentError } = await this.supabase
        .from('appointments')
        .select('id, status, created_at')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      if (appointmentError) throw appointmentError;

      // Calculate metrics
      const currentRevenue = revenueData.reduce((sum, entry) => sum + entry.amount, 0);
      const previousRevenue = await this.getPreviousPeriodRevenue(dateRange);
      const revenueChange = this.calculatePercentageChange(currentRevenue, previousRevenue);

      const currentPatients = patientData.length;
      const previousPatients = await this.getPreviousPeriodPatients(dateRange);
      const patientChange = this.calculatePercentageChange(currentPatients, previousPatients);

      const currentAppointments = appointmentData.length;
      const previousAppointments = await this.getPreviousPeriodAppointments(dateRange);
      const appointmentChange = this.calculatePercentageChange(currentAppointments, previousAppointments);

      const growthRate = (revenueChange + patientChange + appointmentChange) / 3;

      return {
        monthlyRevenue: {
          value: `$${currentRevenue.toLocaleString()}`,
          change: revenueChange,
          trend: revenueChange >= 0 ? 'up' : 'down',
        },
        totalPatients: {
          value: currentPatients.toLocaleString(),
          change: patientChange,
          trend: patientChange >= 0 ? 'up' : 'down',
        },
        appointments: {
          value: currentAppointments.toLocaleString(),
          change: appointmentChange,
          trend: appointmentChange >= 0 ? 'up' : 'down',
        },
        growthRate: {
          value: `${growthRate.toFixed(1)}%`,
          change: growthRate - await this.getPreviousPeriodGrowthRate(dateRange),
          trend: growthRate >= 0 ? 'up' : 'down',
        },
      };
    } catch (error) {
      logger.error("KPI metrics service failure:", error);
      if (error instanceof ErrorResponse) throw error;
      throw new ErrorResponse({
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to load KPI metrics",
        originalError: error,
      });
    }
  }

  async getAppointmentOverview(userId: string, startDate?: string, endDate?: string): Promise<AppointmentOverview> {
    try {
      if (!validateUUID(userId)) {
        throw new ErrorResponse({
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid user ID format",
        });
      }

      const today = new Date().toISOString().split('T')[0];

      // Get today's appointments
      const { data: todayAppointments, error: appointmentError } = await this.supabase
        .from('appointments')
        .select(`
          id,
          patients (name),
          time,
          type,
          status
        `)
        .eq('date', today)
        .order('time');

      if (appointmentError) throw appointmentError;

      // Get appointment stats
      const { data: stats, error: statsError } = await this.supabase
        .from('appointments')
        .select('status')
        .gte('date', startDate || today)
        .lte('date', endDate || today);

      if (statsError) throw statsError;

      // Calculate time slot utilization
      const timeSlots = {
        morning: this.calculateUtilization(todayAppointments, '06:00', '12:00'),
        afternoon: this.calculateUtilization(todayAppointments, '12:00', '17:00'),
        evening: this.calculateUtilization(todayAppointments, '17:00', '21:00'),
      };

      return {
        todayAppointments: todayAppointments.map(apt => ({
          id: apt.id,
          patientName: apt.patients.name,
          time: this.formatTime(apt.time),
          type: apt.type,
          status: apt.status,
        })),
        appointmentStats: {
          total: stats.length,
          completed: stats.filter(s => s.status === 'completed').length,
          scheduled: stats.filter(s => s.status === 'scheduled').length,
          cancelled: stats.filter(s => s.status === 'cancelled').length,
        },
        timeSlotUtilization: timeSlots,
      };
    } catch (error) {
      logger.error("Appointment overview service failure:", error);
      if (error instanceof ErrorResponse) throw error;
      throw new ErrorResponse({
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to load appointment overview",
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
      // Get revenue metrics
      const { data: revenueData, error: revenueError } = await this.supabase
        .from('revenue_entries')
        .select('amount, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (revenueError) throw revenueError;

      // Get revenue by service
      const { data: serviceData, error: serviceError } = await this.supabase
        .from('revenue_entries')
        .select('service, amount')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (serviceError) throw serviceError;

      // Calculate revenue by month
      const revenueByMonth = revenueData.reduce((acc, entry) => {
        const month = new Date(entry.created_at).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + entry.amount;
        return acc;
      }, {});

      // Calculate revenue by service
      const revenueByService = serviceData.reduce((acc, entry) => {
        acc[entry.service] = (acc[entry.service] || 0) + entry.amount;
        return acc;
      }, {});

      return {
        monthlyRevenue: {
          months: Object.keys(revenueByMonth),
          revenue: Object.values(revenueByMonth),
          expenses: [85000, 88000, 90000, 92000, 89000, 91000],
          profit: [35000, 37000, 38000, 38000, 38000, 41000],
        },
        revenueByService: Object.keys(revenueByService).map(service => ({
          service,
          value: revenueByService[service],
          color: '#40E0D0', // Default color
        })),
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
      // Get patient metrics
      const { data: patientData, error: patientError } = await this.supabase
        .from('patients')
        .select('id, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (patientError) throw patientError;

      // Calculate patient growth
      const patientGrowth = patientData.reduce((acc, entry) => {
        const month = new Date(entry.created_at).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Calculate demographics
      const demographics = patientData.reduce((acc, entry) => {
        const ageGroup = this.getAgeGroup(entry.age);
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        return acc;
      }, {});

      return {
        patientGrowth: {
          months: Object.keys(patientGrowth),
          values: Object.values(patientGrowth),
        },
        demographics: Object.keys(demographics).map(ageGroup => ({
          ageGroup,
          percentage: (demographics[ageGroup] / patientData.length) * 100,
        })),
      };
    } catch (error) {
      console.error("Error in getPatientMetrics:", error);
      throw error;
    }
  }

  async getStaffMetrics(userId: string, startDate?: string, endDate?: string) {
    try {
      // Get staff metrics
      const { data: staffData, error: staffError } = await this.supabase
        .from('staff')
        .select('id, name, role')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (staffError) throw staffError;

      // Calculate staff metrics
      const staffMetrics = staffData.map(staff => ({
        id: staff.id,
        name: staff.name,
        role: staff.role,
        metrics: {
          appointmentsCompleted: 145,
          patientSatisfaction: 98,
          revenue: 52000,
        },
      }));

      return staffMetrics;
    } catch (error) {
      console.error("Error in getStaffMetrics:", error);
      throw error;
    }
  }

  // Helper methods
  private getDateRangeQuery(startDate?: string, endDate?: string) {
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
    return { start, end };
  }

  private async getPreviousPeriodRevenue(currentRange: { start: string; end: string }) {
    const monthDiff = this.getMonthDifference(new Date(currentRange.start), new Date(currentRange.end));
    const previousStart = new Date(new Date(currentRange.start).setMonth(new Date(currentRange.start).getMonth() - monthDiff));
    const previousEnd = new Date(new Date(currentRange.end).setMonth(new Date(currentRange.end).getMonth() - monthDiff));

    const { data, error } = await this.supabase
      .from('revenue_entries')
      .select('amount')
      .gte('created_at', previousStart.toISOString())
      .lte('created_at', previousEnd.toISOString());

    if (error) throw error;
    return data.reduce((sum, entry) => sum + entry.amount, 0);
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  }

  private getMonthDifference(start: Date, end: Date): number {
    return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  }

  private calculateUtilization(appointments: any[], startTime: string, endTime: string): number {
    const totalSlots = this.getTimeSlotCount(startTime, endTime);
    const usedSlots = appointments.filter(apt => {
      const aptTime = apt.time;
      return aptTime >= startTime && aptTime < endTime;
    }).length;
    return Math.round((usedSlots / totalSlots) * 100);
  }

  private getTimeSlotCount(start: string, end: string): number {
    const [startHour] = start.split(':').map(Number);
    const [endHour] = end.split(':').map(Number);
    return (endHour - startHour) * 2; // Assuming 30-minute slots
  }

  private formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  private getAgeGroup(age: number): string {
    if (age < 18) return '0-17';
    if (age < 30) return '18-30';
    if (age < 50) return '31-50';
    if (age < 70) return '51-70';
    return '70+';
  }

  // Real-time subscription methods
  setupRealtimeSubscriptions(userId: string, callback: (data: any) => void) {
    const channel = this.supabase
      .channel(`dashboard-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'revenue_entries',
      }, payload => {
        this.handleRealtimeUpdate('revenue', payload, callback);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
      }, payload => {
        this.handleRealtimeUpdate('appointments', payload, callback);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patients',
      }, payload => {
        this.handleRealtimeUpdate('patients', payload, callback);
      })
      .subscribe();

    this.realtimeChannels.set(userId, channel);
    return () => this.cleanupRealtimeSubscription(userId);
  }

  private async handleRealtimeUpdate(type: string, payload: any, callback: (data: any) => void) {
    try {
      const metrics = await this.getKPIMetrics(payload.new.user_id);
      callback({ type, data: metrics });
    } catch (error) {
      logger.error(`Error handling realtime update for ${type}:`, error);
    }
  }

  private cleanupRealtimeSubscription(userId: string) {
    const channel = this.realtimeChannels.get(userId);
    if (channel) {
      channel.unsubscribe();
      this.realtimeChannels.delete(userId);
    }
  }
}
