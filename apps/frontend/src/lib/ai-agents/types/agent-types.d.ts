export type DentalAgentType = 'BRAIN_CONSULTANT' | 'MARKETING_COACHING' | 'DATA_RETRIEVAL' | 'PROFITABILITY_APPOINTMENT' | 'RECOMMENDATION' | 'ANALYSIS' | 'PATIENT_CARE' | 'OPERATIONS' | 'STAFF_TRAINING' | 'LAB_CASE_MANAGER' | 'PROCEDURE_CODE' | 'SUPPLIES_MANAGER' | 'MARKETING_ROI' | 'HYGIENE_ANALYTICS' | 'PATIENT_DEMOGRAPHICS' | 'OSHA_COMPLIANCE' | 'INSURANCE_VERIFICATION' | 'DATA_ANALYSIS' | 'REVENUE_HACK' | 'STAFF_OPTIMIZATION';
export interface AIResponse {
    content: string;
    metadata?: Record<string, unknown>;
    confidence?: number;
    recommendations?: string[];
    error?: {
        code: string;
        message: string;
        retryable: boolean;
    };
}
export interface AgentConfig {
    id: string;
    assistantId: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    rateLimit: {
        rpm: number;
        tpm: number;
    };
    caching?: {
        enabled: boolean;
        ttl: number;
    };
    retryConfig?: {
        maxRetries: number;
        backoffFactor: number;
        initialDelayMs: number;
    };
}
export interface AgentCapability {
    name: string;
    description: string;
    confidence: number;
    parameters?: Record<string, unknown>;
}
export interface AgentMetadata {
    capabilities: AgentCapability[];
    specializations: string[];
    constraints: string[];
    version: string;
}
