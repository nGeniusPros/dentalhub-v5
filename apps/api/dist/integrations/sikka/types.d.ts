export interface SikkaConfig {
    baseUrl: string;
    appId: string;
    appKey: string;
    practiceId: string;
    masterCustomerId: string;
    practiceKey: string;
    tokenRefreshThreshold?: number;
    maxRetryAttempts?: number;
    rateLimitDelay?: number;
}
export interface TokenResponse {
    href: string;
    request_key: string;
    start_time: string;
    end_time: string;
    expires_in: string;
    issued_to: string;
    status: string;
    request_count: string;
    scope: string;
    domain: string;
    refresh_key?: string;
}
export interface TokenError {
    http_code: string;
    http_code_desc: string;
    error_code: string;
    short_message: string;
    long_message: string;
    more_information: string;
}
export interface TokenInfo {
    requestKey: string;
    refreshKey?: string;
    expiresAt: Date;
    scope: string[];
}
export interface TokenMetrics {
    refreshAttempts: number;
    lastRefreshTime: Date;
    rateLimitHits: number;
    totalRefreshes: number;
    failedRefreshes: number;
    averageRefreshTime: number;
}
export interface TokenStatus {
    isValid: boolean;
    isExpired: boolean;
    isRevoked: boolean;
    expiresIn: number;
    metrics: TokenMetrics;
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
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface DateRangeParams {
    startdate?: string;
    enddate?: string;
}
export interface PracticeParams extends PaginationParams {
    practice_id?: string;
    national_provider_identifier?: string;
}
export interface Practice {
    practice_id: string;
    practice_name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email?: string;
    national_provider_identifier?: string;
}
export interface AppointmentParams extends PaginationParams, DateRangeParams {
    appointment_sr_no?: string;
    practice_id?: string;
    patient_id?: string;
    guarantor_id?: string;
    provider_id?: string;
    procedure_code?: string;
    status?: string;
    operatory?: string;
    type?: string;
}
export interface Appointment {
    appointment_sr_no: string;
    practice_id: string;
    patient_id: string;
    provider_id: string;
    appointment_date: string;
    appointment_time: string;
    duration: number;
    status: string;
    operatory?: string;
    procedure_codes?: string[];
}
export interface PatientParams extends PaginationParams {
    email?: string;
    practice_id?: string;
    patient_id?: string;
    provider_id?: string;
    guarantor_id?: string;
    firstname?: string;
    lastname?: string;
    first_visit?: string;
    last_visit?: string;
    cell?: string;
    search?: string;
    status?: string;
}
export interface Patient {
    patient_id: string;
    practice_id: string;
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    date_of_birth?: string;
    gender?: string;
    status: string;
}
export interface TreatmentPlanParams extends PaginationParams, DateRangeParams {
    treatment_plan_sr_no?: string;
    practice_id?: string;
    patient_id?: string;
    guarantor_id?: string;
    provider_id?: string;
    procedure_code?: string;
    treatment_plan_status?: string;
    claim_sr_no?: string;
}
export interface TreatmentPlan {
    treatment_plan_sr_no: string;
    practice_id: string;
    patient_id: string;
    provider_id: string;
    procedure_codes: string[];
    amount: number;
    status: string;
    created_date: string;
}
export interface InsuranceCompanyParams extends PaginationParams {
    insurance_company_id?: string;
    practice_id?: string;
}
export interface InsuranceCompany {
    insurance_company_id: string;
    practice_id: string;
    company_name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    payer_id?: string;
}
export interface SikkaApiResponse<T> {
    success: boolean;
    data?: T;
    error?: SikkaApiError;
    timestamp: string;
}
