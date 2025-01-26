export interface AssistantTool {
  type: 'code_interpreter' | 'retrieval' | 'function';
  function?: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface DentalAssistantConfig {
  name: string;
  model: 'gpt-4-1106-preview' | 'gpt-3.5-turbo-1106';
  instructions: string;
  tools: AssistantTool[];
  file_ids?: string[];
  metadata?: Record<string, string>;
}

export interface AssistantMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
  file_ids?: string[];
  metadata?: Record<string, string>;
}

export interface AssistantRun {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  thread_id: string;
  assistant_id: string;
  started_at?: number;
  completed_at?: number;
  model: string;
  instructions?: string;
  tools: AssistantTool[];
  file_ids: string[];
}

export interface AssistantError {
  code: string;
  message: string;
  type: 'invalid_request_error' | 'api_error' | 'rate_limit_error';
}
