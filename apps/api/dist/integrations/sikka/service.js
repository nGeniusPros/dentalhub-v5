import axios from 'axios';
import { handleSikkaError, isRetryableError } from './error';
import { sikkaConfig, RETRY_OPTIONS, TIMEOUT_OPTIONS } from './config';
import { apiCache } from '../../utils/cache';
// Initialize axios instance for Sikka API
const sikkaApi = axios.create({
    baseURL: sikkaConfig.baseUrl,
    headers: {
        'Authorization': `Bearer ${sikkaConfig.apiKey}`,
        'X-Practice-ID': sikkaConfig.practiceId,
        'Content-Type': 'application/json',
    },
    timeout: TIMEOUT_OPTIONS.request,
});
// Add retry interceptor
sikkaApi.interceptors.response.use(response => response, async (error) => {
    let retryCount = 0;
    const originalRequest = error.config;
    while (retryCount < RETRY_OPTIONS.maxRetries && isRetryableError(error)) {
        retryCount++;
        const delayMs = Math.min(RETRY_OPTIONS.initialDelayMs * Math.pow(2, retryCount - 1), RETRY_OPTIONS.maxDelayMs);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        try {
            return await sikkaApi(originalRequest);
        }
        catch (retryError) {
            error = retryError;
        }
    }
    throw error;
});
/**
 * Verify insurance information
 */
export async function verifyInsurance(data) {
    const cacheKey = `verifyInsurance-${JSON.stringify(data)}`;
    return apiCache.get(cacheKey, async () => {
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
    return apiCache.get(cacheKey, async () => {
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
    return apiCache.get(cacheKey, async () => {
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
