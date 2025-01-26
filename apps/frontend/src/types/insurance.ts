export interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact: {
    phone: string;
    fax?: string;
    email: string;
    website?: string;
  };
  payerId: string;
  status: 'active' | 'inactive';
  electronicClaims: boolean;
  realTimeEligibility: boolean;
}

export interface InsurancePlan {
  id: string;
  name: string;
  provider: InsuranceProvider;
  planType: 'PPO' | 'HMO' | 'EPO' | 'Indemnity' | 'Medicare' | 'Medicaid';
  groupNumber?: string;
  planNumber?: string;
  coverage: InsuranceCoverage[];
  effectiveDate: string;
  terminationDate?: string;
  status: 'active' | 'inactive' | 'pending';
  deductible: {
    individual: number;
    family: number;
    preventive: boolean;
  };
  maximumBenefit: {
    annual: number;
    lifetime: number;
    preventive: boolean;
  };
  waitingPeriods: {
    preventive: number;
    basic: number;
    major: number;
    orthodontic: number;
  };
  preAuthorizationRequired: boolean;
  preAuthorizationThreshold?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceCoverage {
  id: string;
  category: 'preventive' | 'basic' | 'major' | 'orthodontic';
  procedures: Array<{
    code: string;
    coverage: number;
    limitations?: string[];
    frequencies?: {
      type: 'days' | 'months' | 'years';
      value: number;
      perLifetime?: boolean;
    }[];
  }>;
  deductibleApplies: boolean;
  waitingPeriodApplies: boolean;
  maxBenefitApplies: boolean;
  copay?: number;
  notes?: string;
}

export interface InsuranceClaim {
  id: string;
  planId: string;
  patientId: string;
  providerId: string;
  claimNumber?: string;
  dateOfService: string;
  procedures: Array<{
    code: string;
    fee: number;
    tooth?: string;
    surface?: string;
    quadrant?: string;
    date: string;
  }>;
  diagnosis?: string[];
  attachments?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'denied' | 'partial';
  submittedAt?: string;
  processedAt?: string;
  paymentAmount?: number;
  paymentDate?: string;
  denialReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceVerification {
  id: string;
  planId: string;
  patientId: string;
  verificationDate: string;
  status: 'active' | 'inactive' | 'termed';
  effectiveDate: string;
  terminationDate?: string;
  benefits: {
    deductible: {
      individual: {
        amount: number;
        met: number;
      };
      family: {
        amount: number;
        met: number;
      };
    };
    maximumBenefit: {
      annual: {
        amount: number;
        used: number;
      };
      lifetime: {
        amount: number;
        used: number;
      };
    };
    preventive: number;
    basic: number;
    major: number;
    orthodontic: number;
  };
  limitations?: string[];
  exclusions?: string[];
  notes?: string;
  verifiedBy: string;
  createdAt: string;
  updatedAt: string;
}
