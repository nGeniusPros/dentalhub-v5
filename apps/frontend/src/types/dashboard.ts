export interface StaffMetrics {
  id: string;
  name: string;
  role: string;
  metrics: {
    appointmentsCompleted: number;
    patientSatisfaction: number;
    revenue: number;
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
