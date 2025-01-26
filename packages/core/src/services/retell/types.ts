export interface RetellConfig {
  baseUrl: string;
  wsUrl: string;
  apiKey: string;
  agentId: string;
  llmId: string;
  phoneNumber: string;
}

export interface CallEventPayload {
  eventType:
    | "call.started"
    | "call.ended"
    | "call.transcription"
    | "call.recording";
  callId: string;
  timestamp: string;
  data: any;
}

export interface CallResponse {
  callId: string;
  status: string;
  agentId: string;
  customerNumber: string;
  createdAt: string;
}

export interface CallConfig {
  llmConfig?: {
    temperature?: number;
    maxTokens?: number;
  };
  recordingConfig?: {
    enabled: boolean;
    format?: "mp3" | "wav";
  };
  webhookConfig?: {
    url: string;
    events: string[];
  };
}
