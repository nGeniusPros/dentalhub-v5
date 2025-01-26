export interface PayrollProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
}

export interface PayPeriod {
  startDate: string;
  endDate: string;
}

export interface Timesheet {
  employeeId: string;
  name: string;
  regularHours: number;
  overtimeHours: number;
  ptoHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
}

export interface PayrollSummary {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
}

export interface PayrollData {
  provider: PayrollProvider | null;
  payPeriod: PayPeriod;
  timesheets: Timesheet[];
  summary: PayrollSummary;
}
