export interface SikkaInsuranceVerification {
  insuranceId: string;
  carrierId: string;
  carrierName: string;
  subscriberId: string;
  subscriberName: string;
  effectiveDate: string;
  terminationDate?: string;
  groupNumber?: string;
  planType: string;
  status: "active" | "inactive" | "pending";
  verificationDate: string;
}

export interface SikkaEligibilityCheck {
  patientId: string;
  insuranceId: string;
  eligibilityStatus: "eligible" | "ineligible" | "pending";
  checkDate: string;
  coverageDetails: {
    preventiveCare: boolean;
    basicServices: boolean;
    majorServices: boolean;
    orthodontics: boolean;
    deductibles: {
      individual: number;
      family: number;
      remaining: number;
    };
    maximums: {
      annual: number;
      lifetime: number;
      remaining: number;
    };
    waitingPeriods?: {
      basicServices?: number;
      majorServices?: number;
      orthodontics?: number;
    };
  };
}

export interface SikkaBenefitsVerification {
  patientId: string;
  insuranceId: string;
  verificationDate: string;
  benefits: {
    preventiveCare: {
      covered: boolean;
      coinsurance: number;
      frequency?: string;
      limitations?: string[];
    };
    basicServices: {
      covered: boolean;
      coinsurance: number;
      waitingPeriod?: number;
      limitations?: string[];
    };
    majorServices: {
      covered: boolean;
      coinsurance: number;
      waitingPeriod?: number;
      limitations?: string[];
    };
    orthodontics?: {
      covered: boolean;
      coinsurance: number;
      lifetime_maximum?: number;
      age_limit?: number;
      waitingPeriod?: number;
    };
  };
  exclusions?: string[];
  notes?: string[];
}

export interface SikkaClaimProcessing {
  claimId: string;
  patientId: string;
  insuranceId: string;
  submissionDate: string;
  status: "submitted" | "processing" | "accepted" | "rejected" | "pending";
  procedures: Array<{
    code: string;
    description: string;
    date: string;
    tooth?: string;
    surface?: string;
    quadrant?: string;
    fee: number;
    allowedAmount?: number;
    paidAmount?: number;
    adjustmentReason?: string;
  }>;
  totalFee: number;
  totalAllowed?: number;
  totalPaid?: number;
  patientResponsibility?: number;
  adjustments?: Array<{
    code: string;
    description: string;
    amount: number;
  }>;
  notes?: string[];
  eob?: {
    documentId: string;
    url: string;
  };
}

export interface SikkaErrorDetails {
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
}

export interface SikkaResponse<T> {
  status: "success" | "error" | "pending";
  message?: string;
  data?: T;
  errors?: SikkaErrorDetails[];
}

export type SikkaVerifyInsuranceResponse =
  SikkaResponse<SikkaInsuranceVerification>;
export type SikkaCheckEligibilityResponse =
  SikkaResponse<SikkaEligibilityCheck>;
export type SikkaVerifyBenefitsResponse =
  SikkaResponse<SikkaBenefitsVerification>;
export type SikkaProcessClaimResponse = SikkaResponse<SikkaClaimProcessing>;
