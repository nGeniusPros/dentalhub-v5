export interface RetellConfig {
  baseUrl: string;
  wsUrl: string;
  apiKey: string;
  agentId: string;
  llmId: string;
  phoneNumber: string;
}

export interface RetellTranscriptionData {
  speakerId: string;
  speakerType: 'agent' | 'customer';
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
  isFinal: boolean;
}

export interface RetellCallEndedData {
  duration: number;
  endReason: 'completed' | 'disconnected' | 'error';
  recordingUrl?: string;
  transcriptionStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  analysisStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  metadata?: {
    agentName?: string;
    customerName?: string;
    notes?: string;
    tags?: string[];
  };
}

export interface RetellCallStartedData {
  startTime: string;
  agentId: string;
  customerNumber: string;
  llmId: string;
  metadata?: {
    agentName?: string;
    customerName?: string;
    scheduledTime?: string;
    purpose?: string;
  };
}

export interface RetellRecordingData {
  url: string;
  duration: number;
  format: 'mp3' | 'wav';
  size: number;
  metadata?: {
    quality?: string;
    bitrate?: number;
    channels?: number;
  };
}

export type RetellEventData = 
  | { eventType: 'call.started'; data: RetellCallStartedData }
  | { eventType: 'call.ended'; data: RetellCallEndedData }
  | { eventType: 'call.transcription'; data: RetellTranscriptionData }
  | { eventType: 'call.recording'; data: RetellRecordingData };

export interface CallEventPayload extends RetellEventData {
  callId: string;
  timestamp: string;
}

export interface CallResponse {
  callId: string;
  status: 'initiated' | 'connecting' | 'in-progress' | 'completed' | 'failed';
  agentId: string;
  customerNumber: string;
  createdAt: string;
  metadata?: {
    scheduledTime?: string;
    purpose?: string;
    priority?: 'high' | 'medium' | 'low';
  };
}

export interface CallConfig {
  llmConfig?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    stopSequences?: string[];
  };
  recordingConfig?: {
    enabled: boolean;
    format?: 'mp3' | 'wav';
    quality?: 'high' | 'medium' | 'low';
    stereo?: boolean;
  };
  webhookConfig?: {
    url: string;
    events: Array<'call.started' | 'call.ended' | 'call.transcription' | 'call.recording'>;
    retryCount?: number;
    secret?: string;
  };
}