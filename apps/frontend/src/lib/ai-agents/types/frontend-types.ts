import { DentalAgentType } from "./agent-types";

export interface PracticeMetrics {
  monthlyRevenue: number;
  patientCount: number;
  appointmentRate: number;
  treatmentAcceptance: number;
  hygieneProduction?: number;
  insuranceAging?: number;
  supplyCosts?: number;
  marketingROI?: number;
  scheduleUtilization?: number;
}

export interface AIMessage {
  role: "user" | "assistant" | "agent";
  content: string;
  metadata?: {
    agentId?: DentalAgentType;
    confidence?: number;
    timestamp: number;
    sources?: string[];
    metrics?: Partial<PracticeMetrics>;
  };
}

export interface AIError {
  code: string;
  message: string;
  retryable: boolean;
  agentType?: DentalAgentType;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  agents?: DentalAgentType[];
  priority?: "speed" | "accuracy";
}
