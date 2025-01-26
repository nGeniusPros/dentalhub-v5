export type DentalAgentType =
  | "BRAIN_CONSULTANT"
  | "MARKETING_COACHING"
  | "DATA_RETRIEVAL"
  | "PROFITABILITY_APPOINTMENT"
  | "RECOMMENDATION"
  | "ANALYSIS"
  | "PATIENT_CARE"
  | "OPERATIONS"
  | "STAFF_TRAINING"
  | "LAB_CASE_MANAGER"
  | "PROCEDURE_CODE"
  | "SUPPLIES_MANAGER"
  | "MARKETING_ROI"
  | "HYGIENE_ANALYTICS"
  | "PATIENT_DEMOGRAPHICS"
  | "OSHA_COMPLIANCE"
  | "INSURANCE_VERIFICATION"
  | "DATA_ANALYSIS"
  | "REVENUE_HACK"
  | "STAFF_OPTIMIZATION";

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
    rpm: number; // Requests per minute
    tpm: number; // Tokens per minute
  };
  caching?: {
    enabled: boolean;
    ttl: number; // Time to live in seconds
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
  confidence: number; // 0-1 indicating how confident the agent is in this capability
  parameters?: Record<string, unknown>;
}

export interface AgentMetadata {
  capabilities: AgentCapability[];
  specializations: string[];
  constraints: string[];
  version: string;
}
