import axios from 'axios';
import { handleSikkaError } from './error';
import { sikkaConfig, TIMEOUT_OPTIONS, PAGINATION_DEFAULTS } from './config';
import { prepareRequestParams, getCacheTTL, getRequestTimeout, generateCacheKey, validateRequestParams } from './utils';
import CacheManager from '../../utils/cache';
import SikkaTokenService from './token-service';
// Sikka API Cache Configuration
const sikkaApiCache = new CacheManager({});
const tokenManager = new SikkaTokenService({
    baseUrl: sikkaConfig.baseUrl,
    appId: sikkaConfig.appId,
    appKey: sikkaConfig.appKey,
    practiceId: sikkaConfig.practiceId,
});
// Initialize axios instance for Sikka API
const sikkaApi = axios.create({
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
sikkaApi.interceptors.response.use(response => response, async (error) => {
    // If token is expired, it will be refreshed by tokenManager on next request
    if (error.response?.status === 401) {
        const originalRequest = error.config;
        try {
            // Force token refresh
            await tokenManager.refreshToken();
            // Retry the request
            return await sikkaApi(originalRequest);
        }
        catch (refreshError) {
            throw refreshError;
        }
    }
    // Handle other retryable errors
    if (error.response?.status >= 500) {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
            originalRequest._retry = 0;
        }
        if (originalRequest._retry < 3) {
            originalRequest._retry++;
            const delay = 500 * Math.pow(2, originalRequest._retry - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
            return sikkaApi(originalRequest);
        }
    }
    throw error;
});
/**
 * Base function for making Sikka API requests
 */
async function makeRequest(endpoint, params = {}, options = {}, requiredFields = []) {
    // Validate parameters
    validateRequestParams(params, requiredFields);
    // Prepare request parameters
    const requestParams = prepareRequestParams(params, options);
    // Generate cache key
    const cacheKey = generateCacheKey(endpoint, requestParams);
    return sikkaApiCache.get(cacheKey, async () => {
        try {
            const response = await sikkaApi.get(endpoint, {
                params: requestParams,
                timeout: getRequestTimeout(options)
            });
            return response.data;
        }
        catch (error) {
            throw handleSikkaError(error);
        }
    }, getCacheTTL(options));
}
/**
 * Verify insurance information
 */
export async function verifyInsurance(data) {
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
        }
        catch (error) {
            throw handleSikkaError(error);
        }
    });
}
/**
 * Check patient eligibility
 */
export async function checkEligibility(data) {
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
        }
        catch (error) {
            throw handleSikkaError(error);
        }
    });
}
/**
 * Verify benefits coverage
 */
export async function verifyBenefits(data) {
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
        }
        catch (error) {
            throw handleSikkaError(error);
        }
    });
}
/**
 * Process insurance claim
 */
export async function processClaim(data) {
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
    }
    catch (error) {
        throw handleSikkaError(error);
    }
}
/**
 * Get dental practice information
 */
export async function getPracticeInfo(params = {}, options = {}) {
    return makeRequest('/practices', params, options, ['practice_id']);
}
/**
 * Get dental appointments
 */
export async function getAppointments(params = {}, options = {}) {
    return makeRequest('/appointments', params, {
        ...options,
        limit: options.limit || PAGINATION_DEFAULTS.defaultLimit
    });
}
/**
 * Get available appointment slots
 */
export async function getAvailableSlots(params = {}, options = {}) {
    return makeRequest('/appointments_available_slots', params, options);
}
/**
 * Get patient information with enhanced search capabilities
 */
export async function getPatients(params = {}, options = {}) {
    return makeRequest('/patients', params, {
        ...options,
        limit: options.limit || PAGINATION_DEFAULTS.defaultLimit
    });
}
/**
 * Get dental-specific patient information
 */
export async function getDentalPatients(params = {}, options = {}) {
    return makeRequest('/patients/dental_patients', params, {
        ...options,
        limit: options.limit || PAGINATION_DEFAULTS.defaultLimit
    });
}
/**
 * Get patient treatment history
 */
export async function getPatientTreatmentHistory(patientId, params = {}, options = {}) {
    return makeRequest('/patient_treatment_history', { ...params, patient_id: patientId }, options, ['patient_id']);
}
/**
 * Get dental treatment plans
 */
export async function getTreatmentPlans(params = {}, options = {}) {
    return makeRequest('/treatment_plans', params, {
        ...options,
        limit: options.limit || PAGINATION_DEFAULTS.defaultLimit
    });
}
/**
 * Get dental insurance companies
 */
export async function getInsuranceCompanies(params = {}, options = {}) {
    return makeRequest('/insurance_companies', params, options);
}
/**
 * Get dental insurance coverage details
 */
export async function getInsurancePlanCoverage(insuranceCompanyId, practiceId, options = {}) {
    return makeRequest('/insurance_plan_coverage', {
        insurance_company_id: insuranceCompanyId,
        practice_id: practiceId
    }, options);
}
/**
 * Update claim status
 */
export async function updateClaimStatus(data) {
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
    }
    catch (error) {
        throw handleSikkaError(error);
    }
}
