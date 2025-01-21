import axios, { AxiosInstance } from 'axios';
import {
  SikkaConfig,
  PaginationParams,
  DateRangeParams,
  PracticeParams,
  AppointmentParams,
  PatientParams,
  TreatmentPlanParams,
  InsuranceCompanyParams
} from './types';
import { handleSikkaError, isRetryableError } from './error';
import { sikkaConfig, RETRY_OPTIONS, TIMEOUT_OPTIONS } from './config';
import CacheManager from '../../utils/cache';

// Sikka API Cache Configuration

const sikkaApiCache = new CacheManager({});
import SikkaTokenService from './token-service';

// Cache TTL configurations (in seconds)
const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 24 * 60 * 60, // 24 hours
} as const;

const tokenManager = new SikkaTokenService({
  baseUrl: sikkaConfig.baseUrl,
  appId: sikkaConfig.appId,
  appKey: sikkaConfig.appKey,
  practiceId: sikkaConfig.practiceId,
});

// Initialize axios instance for Sikka API
const sikkaApi: AxiosInstance = axios.create({
  baseURL: sikkaConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUT_OPTIONS.timeout,
});

// Add token interceptor
sikkaApi.interceptors.request.use(async (config) => {
  const token = await tokenManager.getAccessToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  config.headers['X-Practice-ID'] = sikkaConfig.practiceId;
  config.headers['Accept'] = 'application/json';
  return config;
});

// Add retry interceptor
sikkaApi.interceptors.response.use(
  response => response,
  async error => {
    // If token is expired, it will be refreshed by tokenManager on next request
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      try {
        // Force token refresh
        await tokenManager.refreshToken();
        // Retry the request
        return await sikkaApi(originalRequest);
      } catch (refreshError) {
        throw refreshError;
      }
    }

    // Handle other retryable errors
    if (RETRY_OPTIONS.retryCondition(error)) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = 0;
      }
      if (originalRequest._retry < RETRY_OPTIONS.retries) {
        originalRequest._retry++;
        const delay = RETRY_OPTIONS.retryDelay * Math.pow(2, originalRequest._retry - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return sikkaApi(originalRequest);
      }
    }

    throw error;
  }
);

/**
 * Verify insurance information
 */
export async function verifyInsurance(data: {
  patientId: string;
  insuranceInfo: {
    carrierId: string;
    memberId: string;
    groupNumber?: string;
  };
}) {
  const cacheKey = `verifyInsurance-${JSON.stringify(data)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.post('/insurance/verify', {
        practice_id: sikkaConfig.practiceId,
        patient_id: data.patientId,
        carrier_id: data.insuranceInfo.carrierId,
        member_id: data.insuranceInfo.memberId,
        group_number: data.insuranceInfo.groupNumber,
      });

      return {
        verified: response.data.verified,
        details: response.data.verification_details,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Check patient eligibility
 */
export async function checkEligibility(data: {
  patientId: string;
  serviceDate: string;
  serviceTypes: string[];
}) {
  const cacheKey = `checkEligibility-${JSON.stringify(data)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.post('/eligibility/check', {
        practice_id: sikkaConfig.practiceId,
        patient_id: data.patientId,
        service_date: data.serviceDate,
        service_types: data.serviceTypes,
      });

      return {
        eligible: response.data.eligible,
        coverageDetails: response.data.coverage_details,
        limitations: response.data.limitations,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Verify benefits coverage
 */
export async function verifyBenefits(data: {
  patientId: string;
  procedureCodes: string[];
  serviceDate: string;
}) {
  const cacheKey = `verifyBenefits-${JSON.stringify(data)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.post('/benefits/verify', {
        practice_id: sikkaConfig.practiceId,
        patient_id: data.patientId,
        procedure_codes: data.procedureCodes,
        service_date: data.serviceDate,
      });

      return {
        covered: response.data.covered,
        benefitsDetails: response.data.benefits_details,
        limitations: response.data.limitations,
        deductibles: response.data.deductibles,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Process insurance claim
 */
export async function processClaim(data: {
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
}) {
  try {
    const response = await sikkaApi.post('/claims/submit', {
      practice_id: sikkaConfig.practiceId,
      patient_id: data.patientId,
      service_date: data.claimDetails.serviceDate,
      procedures: data.claimDetails.procedures,
      diagnosis_codes: data.claimDetails.diagnosisCodes,
      place_of_service: data.claimDetails.placeOfService,
    });

    return {
      claimId: response.data.claim_id,
      status: response.data.status,
      acknowledgement: response.data.acknowledgement,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    throw handleSikkaError(error);
  }
}

// Practice Management
/**
 * Get dental practice information
 */
export async function getPracticeInfo(params: PracticeParams = {}) {
  try {
    const response = await sikkaApi.get('/practices', { params });
    return response.data;
  } catch (error) {
    throw handleSikkaError(error);
  }
}

// Appointment Management
/**
 * Get dental appointments
 */
export async function getAppointments(params: AppointmentParams = {}) {
  const cacheKey = `appointments-${JSON.stringify(params)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/appointments', { params });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.SHORT);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Get available appointment slots
 */
export async function getAvailableSlots(params: AppointmentParams = {}) {
  try {
    const response = await sikkaApi.get('/appointments_available_slots', { params });
    return response.data;
  } catch (error) {
    throw handleSikkaError(error);
  }
}

// Patient Management
/**
 * Get patient information
 */
export async function getPatients(params: PatientParams = {}) {
  const cacheKey = `patients-${JSON.stringify(params)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/patients', { params });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.MEDIUM);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Get dental-specific patient information
 */
export async function getDentalPatients(params: PatientParams = {}) {
  const cacheKey = `dental-patients-${JSON.stringify(params)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/patients/dental_patients', { params });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.MEDIUM);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Get patient treatment history
 */
export async function getPatientTreatmentHistory(patientId: string, params: DateRangeParams = {}) {
  const cacheKey = `treatment-history-${patientId}-${JSON.stringify(params)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/patient_treatment_history', {
        params: { patient_id: patientId, ...params }
      });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.MEDIUM);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

// Treatment Plans
/**
 * Get dental treatment plans
 */
export async function getTreatmentPlans(params: TreatmentPlanParams = {}) {
  const cacheKey = `treatment-plans-${JSON.stringify(params)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/treatment_plans', { params });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.SHORT);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

// Insurance Companies
/**
 * Get dental insurance companies
 */
export async function getInsuranceCompanies(params: InsuranceCompanyParams = {}) {
  const cacheKey = `insurance-companies-${JSON.stringify(params)}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/insurance_companies', { params });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.LONG);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Get dental insurance coverage details
 */
export async function getInsurancePlanCoverage(insuranceCompanyId: string, practiceId?: string) {
  const cacheKey = `insurance-coverage-${insuranceCompanyId}-${practiceId}`;
  return sikkaApiCache.get(cacheKey, async () => {
    try {
      const response = await sikkaApi.get('/insurance_plan_coverage', {
        params: {
          insurance_company_id: insuranceCompanyId,
          practice_id: practiceId
        }
      });
      const data = response.data;
      sikkaApiCache.set(cacheKey, data, CACHE_TTL.LONG);
      return data;
    } catch (error) {
      throw handleSikkaError(error);
    }
  });
}

/**
 * Update claim status
 */
export async function updateClaimStatus(data: {
  claimId: string;
  status: string;
  notes?: string;
}) {
  try {
    const response = await sikkaApi.put(`/claims/${data.claimId}/status`, {
      practice_id: sikkaConfig.practiceId,
      status: data.status,
      notes: data.notes,
    });

    return {
      claimId: response.data.claim_id,
      status: response.data.status,
      acknowledgement: response.data.acknowledgement,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    throw handleSikkaError(error);
  }
}