export interface Employee {
  id: string;
  personalInfo: {
    name: string;
    ssn: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
  };
  employmentDetails: {
    role: string;
    department: string;
    startDate: string;
    status: 'active' | 'inactive' | 'on-leave';
    compensation: {
      startingPay: number;
      currentPay: number;
      lastRaiseDate?: string;
      nextReviewDate?: string;
      payFrequency: 'weekly' | 'bi-weekly' | 'monthly';
    };
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
  };
  documents: EmployeeDocument[];
  credentials: {
    username: string;
    password?: string;
    permissions: string[];
  };
}

export interface EmployeeDocument {
  id: string;
  type: 'identification' | 'certification' | 'tax' | 'insurance' | 'review' | 'other';
  name: string;
  fileUrl: string;
  uploadDate: string;
  expirationDate?: string;
  status: 'valid' | 'expired' | 'pending';
  required: boolean;
}

export interface SalaryHistory {
  id: string;
  employeeId: string;
  amount: number;
  effectiveDate: string;
  reason: string;
  approvedBy: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewDate: string;
  reviewer: string;
  rating: number;
  strengths: string[];
  improvements: string[];
  goals: string[];
  comments: string;
  nextReviewDate: string;
}