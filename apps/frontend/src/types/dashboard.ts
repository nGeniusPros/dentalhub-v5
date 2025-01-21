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