import { RequestOptions, DateRangeParams, PracticeParams, AppointmentParams, PatientParams, TreatmentPlanParams, InsuranceCompanyParams } from './types';
/**
 * Verify insurance information
 */
export declare function verifyInsurance(data: {
    patientId: string;
    insuranceInfo: {
        carrierId: string;
        memberId: string;
        groupNumber?: string;
    };
}): Promise<any>;
/**
 * Check patient eligibility
 */
export declare function checkEligibility(data: {
    patientId: string;
    serviceDate: string;
    serviceTypes: string[];
}): Promise<any>;
/**
 * Verify benefits coverage
 */
export declare function verifyBenefits(data: {
    patientId: string;
    procedureCodes: string[];
    serviceDate: string;
}): Promise<any>;
/**
 * Process insurance claim
 */
export declare function processClaim(data: {
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
}): Promise<{
    claimId: any;
    status: any;
    acknowledgement: any;
    timestamp: any;
}>;
/**
 * Get dental practice information
 */
export declare function getPracticeInfo(params?: PracticeParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get dental appointments
 */
export declare function getAppointments(params?: AppointmentParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get available appointment slots
 */
export declare function getAvailableSlots(params?: AppointmentParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get patient information with enhanced search capabilities
 */
export declare function getPatients(params?: PatientParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get dental-specific patient information
 */
export declare function getDentalPatients(params?: PatientParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get patient treatment history
 */
export declare function getPatientTreatmentHistory(patientId: string, params?: DateRangeParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get dental treatment plans
 */
export declare function getTreatmentPlans(params?: TreatmentPlanParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get dental insurance companies
 */
export declare function getInsuranceCompanies(params?: InsuranceCompanyParams, options?: RequestOptions): Promise<unknown>;
/**
 * Get dental insurance coverage details
 */
export declare function getInsurancePlanCoverage(insuranceCompanyId: string, practiceId?: string, options?: RequestOptions): Promise<unknown>;
/**
 * Update claim status
 */
export declare function updateClaimStatus(data: {
    claimId: string;
    status: string;
    notes?: string;
}): Promise<{
    claimId: any;
    status: any;
    acknowledgement: any;
    timestamp: any;
}>;
