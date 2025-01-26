export interface PracticeMetrics {
  monthlyRevenue: number;
  patientCount: number;
  appointmentFillRate: number;
  treatmentAcceptance: number;
}

export interface AIConsultantPrompt {
  metrics: PracticeMetrics;
  focusArea: "revenue" | "operations" | "patient-care" | "marketing";
  question: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "revenue" | "operations" | "patient-care" | "marketing";
  action: string;
  metric?: {
    label: string;
    value: string;
    trend: "up" | "down";
    percentage: number;
  };
}
