import { AIResponse, GenerationOptions } from "../../lib/ai-agents/types";

export type AssistantType =
  | "brain-consultant"
  | "marketing-coaching"
  | "data-retrieval"
  | "profitability"
  | "recommendation"
  | "analysis"
  | "patient-care"
  | "operations"
  | "staff-training"
  | "lab-case-manager"
  | "procedure-code"
  | "supplies-manager"
  | "marketing-roi"
  | "hygiene-analytics"
  | "patient-demographics"
  | "osha-compliance";

export interface OpenAIServiceConfig {
  assistantId: string;
  apiKey: string;
}

export interface AssistantResponse {
  content: string;
  threadId: string;
}

export interface ThreadMessage {
  role: "user" | "assistant";
  content: Array<{
    type: "text";
    text: {
      value: string;
    };
  }>;
}

export interface ThreadRun {
  id: string;
  status:
    | "queued"
    | "in_progress"
    | "completed"
    | "failed"
    | "expired"
    | "cancelled";
  assistant_id: string;
  thread_id: string;
  model: string;
}
