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
  apiKey: string;
  assistantId?: string;
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
    initialDelay: number;
  };
}

export interface AgentCapability {
  name: string;
  description: string;
  confidence: number;
  parameters?: Record<string, unknown>;
  requiredData?: string[];
  outputFormat?: string;
}

export interface AgentMetadata {
  capabilities: AgentCapability[];
  specializations: string[];
  constraints: string[];
  version: string;
  lastUpdated: string;
  supportedLanguages: string[];
}

export interface AgentMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AgentContext {
  practiceMetrics?: {
    revenue?: number;
    patientCount?: number;
    appointmentFillRate?: number;
    treatmentAcceptance?: number;
  };
  userPreferences?: {
    language?: string;
    notificationPreferences?: string[];
  };
  sessionData?: {
    startTime: string;
    interactions: number;
    lastInteraction: string;
  };
}
