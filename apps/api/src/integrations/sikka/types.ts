export interface SikkaConfig {
  baseUrl: string;
  apiKey: string;
  practiceId: string;
}

export interface InsuranceVerificationRequest {
  patientId: string;
  insuranceInfo: {
    carrierId: string;
    memberId: string;
    groupNumber?: string;
  };
}

export interface EligibilityRequest {
  patientId: string;
  serviceDate: string;
  serviceTypes: string[];
}

export interface BenefitsVerificationRequest {
  patientId: string;
  procedureCodes: string[];
  serviceDate: string;
}

export interface ClaimRequest {
  patientId: string;
  claimDetails: {
    serviceDate: string;
    procedures: Array<{
      code: string;
      fee: number;
      diagnosis: string[];
    }>;
    diagnosisCodes: string[];
    placeOfService: string;
  };
}

export interface SikkaApiError {
  code: string;
  message: string;
  details?: any;
}

export interface SikkaApiResponse<T> {
  success: boolean;
  data?: T;
  error?: SikkaApiError;
  timestamp: string;
}