export interface AgentConfig {
  agentId: string;
  llmId: string;
  phoneNumber: string;
}

export interface RetellConfig {
  apiKey: string;
  baseUrl: string;
  wsUrl: string;
  webhookUrl: string;
  agents: AgentConfig[];
}

export interface VoiceCallRequest {
  patientId: string;
  phoneNumber: string;
  purpose: 'appointment_reminder' | 'follow_up' | 'billing' | 'custom';
  customScript?: string;
  language?: string;
  priority?: 'high' | 'normal' | 'low';
  agentId?: string; // Optional - will use first available agent if not specified
}

export interface CallStatus {
  callId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  duration?: number;
  startTime?: string;
  endTime?: string;
  agentId: string;
  phoneNumber: string;
}

export interface TranscriptionResult {
  callId: string;
  transcript: string;
  confidence: number;
  segments: Array<{
    speaker: 'agent' | 'customer';
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
}

export interface AIAnalysisResult {
  callId: string;
  sentiment: {
    overall: number;
    segments: Array<{
      text: string;
      score: number;
      timestamp: string;
    }>;
  };
  intents: Array<{
    name: string;
    confidence: number;
    timestamp: string;
  }>;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  summary: string;
  actionItems: string[];
}

export interface WebhookEvent {
  type: 'call.completed' | 'call.failed' | 'transcription.completed' | 'analysis.completed';
  timestamp: string;
  data: CallStatus | TranscriptionResult | AIAnalysisResult;
  signature?: string;
}

export interface RetellApiError {
  code: string;
  message: string;
  details?: any;
}

export interface RetellApiResponse<T> {
  success: boolean;
  data?: T;
  error?: RetellApiError;
}