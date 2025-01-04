export interface RetellConfig {
  apiKey: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface VoiceCallRequest {
  patientId: string;
  phoneNumber: string;
  purpose: 'appointment_reminder' | 'follow_up' | 'billing' | 'custom';
  customScript?: string;
  language?: string;
  priority?: 'high' | 'normal' | 'low';
}

export interface CallStatus {
  callId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  duration?: number;
  startTime?: string;
  endTime?: string;
}

export interface TranscriptionResult {
  callId: string;
  transcript: string;
  confidence: number;
  segments: Array<{
    speaker: 'ai' | 'human';
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

export interface AIAnalysisResult {
  callId: string;
  sentiment: {
    overall: number;
    segments: Array<{
      text: string;
      score: number;
    }>;
  };
  intents: Array<{
    name: string;
    confidence: number;
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