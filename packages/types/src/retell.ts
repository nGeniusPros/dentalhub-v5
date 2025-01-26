export interface RetellCallStatus {
  callId: string;
  status: "scheduled" | "in-progress" | "completed" | "failed" | "cancelled";
  startTime?: string;
  endTime?: string;
  duration?: number;
  participants: Array<{
    type: "agent" | "customer";
    phoneNumber: string;
    name?: string;
  }>;
  recordingUrl?: string;
  transcriptionStatus?: "pending" | "in-progress" | "completed" | "failed";
  analysisStatus?: "pending" | "in-progress" | "completed" | "failed";
}

export interface RetellTranscription {
  callId: string;
  segments: Array<{
    speakerId: string;
    speakerType: "agent" | "customer";
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
  metadata?: {
    language?: string;
    audioQuality?: number;
    noiseLevel?: number;
  };
}

export interface RetellAnalysis {
  callId: string;
  summary: string;
  sentiment: {
    overall: "positive" | "neutral" | "negative";
    breakdown: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  topics: Array<{
    name: string;
    confidence: number;
    mentions: Array<{
      text: string;
      startTime: number;
      endTime: number;
    }>;
  }>;
  actionItems: Array<{
    description: string;
    priority: "high" | "medium" | "low";
    assignedTo?: string;
    dueDate?: string;
  }>;
  patientConcerns?: Array<{
    type: string;
    description: string;
    severity: "high" | "medium" | "low";
    relatedTopics?: string[];
  }>;
  followUpRecommendations?: Array<{
    type: string;
    description: string;
    timeframe?: string;
    priority: "high" | "medium" | "low";
  }>;
}

export interface RetellErrorDetails {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface RetellResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: RetellErrorDetails;
}

export type RetellCallStatusResponse = RetellResponse<RetellCallStatus>;
export type RetellTranscriptionResponse = RetellResponse<RetellTranscription>;
export type RetellAnalysisResponse = RetellResponse<RetellAnalysis>;
