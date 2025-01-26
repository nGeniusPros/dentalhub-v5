export interface TimeOffRequest {
  id: string;
  employeeId: string;
  type: "vacation" | "sick" | "personal";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
}

export interface TimeOffBalance {
  employeeId: string;
  year: number;
  balances: {
    vacation: TimeOffTypeBalance;
    sick: TimeOffTypeBalance;
    personal: TimeOffTypeBalance;
  };
  accrualRates: {
    vacation: number;
    sick: number;
    personal: number;
  };
  lastAccrualDate: string;
  nextAccrualDate: string;
}

interface TimeOffTypeBalance {
  total: number;
  used: number;
  pending: number;
  accrued: number;
  carryOver: number;
}
