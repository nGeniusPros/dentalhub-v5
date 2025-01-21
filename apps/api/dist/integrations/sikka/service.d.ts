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
