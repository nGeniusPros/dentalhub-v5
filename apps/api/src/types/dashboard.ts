export interface DashboardStats {
  monthlyRevenue: {
    value: number;
    change: number;
  };
  patientGrowth: {
    value: number;
    change: number;
  };
  treatmentAcceptance: {
    value: number;
    change: number;
  };
  appointmentFillRate: {
    value: number;
    change: number;
  };
  insuranceClaims: {
    value: number;
    change: number;
  };
  averageWaitTime: {
    value: number;
    change: number;
  };
  patientSatisfaction: {
    value: number;
    change: number;
  };
  staffProductivity: {
    value: number;
    change: number;
  };
}

export interface KPIMetrics {
  monthlyRevenue: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
  totalPatients: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
  appointments: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
  growthRate: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface AppointmentOverview {
  todayAppointments: Array<{
    id: string;
    patientName: string;
    time: string;
    type: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>;
  appointmentStats: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
  };
  timeSlotUtilization: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}

export interface RevenueAnalytics {
  monthlyRevenue: {
    months: string[];
    revenue: number[];
    expenses: number[];
    profit: number[];
  };
  revenueByService: Array<{
    service: string;
    value: number;
    color: string;
  }>;
}
