export interface BaseReportData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: string | number | boolean | Date;
}

export interface StaffReportData extends BaseReportData {
  name: string;
  role: string;
  hoursWorked: number;
  overtimeHours: number;
}

export interface PerformanceReportData extends BaseReportData {
  metric: string;
  value: number;
  target: number;
  variance: number;
}

export interface TrainingReportData extends BaseReportData {
  course: string;
  completionDate: Date;
  score: number;
  status: "completed" | "in-progress" | "not-started";
}

export interface FinancialReportData extends BaseReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export type ReportData =
  | StaffReportData
  | PerformanceReportData
  | TrainingReportData
  | FinancialReportData;
