export type DentalAgentType =
  | 'BRAIN_CONSULTANT'
  | 'MARKETING_COACHING'
  | 'DATA_RETRIEVAL'
  | 'PROFITABILITY_APPOINTMENT' 
  | 'RECOMMENDATION'
  | 'ANALYSIS'
  | 'PATIENT_CARE'
  | 'OPERATIONS'
  | 'STAFF_TRAINING'
  | 'LAB_CASE_MANAGER'
  | 'PROCEDURE_CODE'
  | 'SUPPLIES_MANAGER'
  | 'MARKETING_ROI'
  | 'HYGIENE_ANALYTICS'
  | 'PATIENT_DEMOGRAPHICS'
  | 'OSHA_COMPLIANCE'
  | 'STAFF_TRAINING';

export interface AIResponse {
  content: string;
  metadata?: Record<string, unknown>;
  confidence?: number;
}

export interface AgentConfig {
  id: string;
  apiKey: string;
  rateLimit: {
    rpm: number;
    tpm: number;
  };
}
