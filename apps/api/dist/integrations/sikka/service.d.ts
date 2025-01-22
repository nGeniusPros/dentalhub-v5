import { DateRangeParams, PracticeParams, AppointmentParams, PatientParams, TreatmentPlanParams, InsuranceCompanyParams } from './types';
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
}): Promise<{
    verified: any;
    details: any;
    timestamp: any;
}>;
/**
 * Check patient eligibility
 */
export declare function checkEligibility(data: {
    patientId: string;
    serviceDate: string;
    serviceTypes: string[];
}): Promise<{
    eligible: any;
    coverageDetails: any;
    limitations: any;
    timestamp: any;
}>;
/**
 * Verify benefits coverage
 */
export declare function verifyBenefits(data: {
    patientId: string;
    procedureCodes: string[];
    serviceDate: string;
}): Promise<{
    covered: any;
    benefitsDetails: any;
    limitations: any;
    deductibles: any;
    timestamp: any;
}>;
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
export declare function getPracticeInfo(params?: PracticeParams): Promise<any>;
/**
 * Get dental appointments
 */
export declare function getAppointments(params?: AppointmentParams): Promise<any>;
/**
 * Get available appointment slots
 */
export declare function getAvailableSlots(params?: AppointmentParams): Promise<any>;
/**
 * Get patient information
 */
export declare function getPatients(params?: PatientParams): Promise<any>;
/**
 * Get dental-specific patient information
 */
export declare function getDentalPatients(params?: PatientParams): Promise<any>;
/**
 * Get patient treatment history
 */
export declare function getPatientTreatmentHistory(patientId: string, params?: DateRangeParams): Promise<any>;
/**
 * Get dental treatment plans
 */
export declare function getTreatmentPlans(params?: TreatmentPlanParams): Promise<any>;
/**
 * Get dental insurance companies
 */
export declare function getInsuranceCompanies(params?: InsuranceCompanyParams): Promise<any>;
/**
 * Get dental insurance coverage details
 */
export declare function getInsurancePlanCoverage(insuranceCompanyId: string, practiceId?: string): Promise<any>;
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
