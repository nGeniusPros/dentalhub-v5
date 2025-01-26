import { ISO8601String } from "./common.js";

// Retell Webhook Types
export interface RetellBaseEvent {
  eventType: string;
  callId: string;
  timestamp: ISO8601String;
}

export interface RetellCallStartedEvent extends RetellBaseEvent {
  eventType: "call.started";
  data: {
    agentId: string;
    customerId?: string;
    startTime: ISO8601String;
    metadata?: Record<string, unknown>;
  };
}

export interface RetellCallEndedEvent extends RetellBaseEvent {
  eventType: "call.ended";
  data: {
    duration: number;
    endTime: ISO8601String;
    reason: string;
    metadata?: Record<string, unknown>;
  };
}

export interface RetellTranscriptionEvent extends RetellBaseEvent {
  eventType: "call.transcription";
  data: {
    text: string;
    speakerId: string;
    speakerType: "agent" | "customer";
    startTime: ISO8601String;
    endTime: ISO8601String;
    metadata?: Record<string, unknown>;
  };
}

export interface RetellRecordingEvent extends RetellBaseEvent {
  eventType: "call.recording";
  data: {
    url: string;
    duration: number;
    format: string;
    metadata?: Record<string, unknown>;
  };
}

export type RetellWebhookEvent =
  | RetellCallStartedEvent
  | RetellCallEndedEvent
  | RetellTranscriptionEvent
  | RetellRecordingEvent;

// Sikka Webhook Types
export interface SikkaBaseEvent {
  eventType: string;
  timestamp: ISO8601String;
  practiceId: string;
  requestId: string;
}

export interface SikkaEligibilityVerifiedEvent extends SikkaBaseEvent {
  eventType: "eligibility.verified";
  data: {
    patientId: string;
    insuranceId: string;
    status: "active" | "inactive" | "pending";
    verificationDate: ISO8601String;
    coverage: {
      planType: string;
      effectiveDate: ISO8601String;
      terminationDate?: ISO8601String;
      coverageDetails: {
        type: string;
        percentage: number;
        remainingBenefit: number;
        annualMaximum: number;
        usedBenefit: number;
        waitingPeriod?: number;
        limitations?: string[];
      }[];
    };
  };
}

export interface SikkaClaimStatusEvent extends SikkaBaseEvent {
  eventType: "claim.status_update";
  data: {
    claimId: string;
    patientId: string;
    status: "submitted" | "in_process" | "approved" | "denied" | "partial";
    updateDate: ISO8601String;
    paymentAmount?: number;
    denialReason?: string;
    remarks?: string;
    eob?: {
      url: string;
      documentId: string;
      uploadDate: ISO8601String;
    };
  };
}

export interface SikkaPreAuthStatusEvent extends SikkaBaseEvent {
  eventType: "preauth.status_update";
  data: {
    preAuthId: string;
    patientId: string;
    status:
      | "submitted"
      | "in_review"
      | "approved"
      | "denied"
      | "additional_info_needed";
    updateDate: ISO8601String;
    approvedProcedures?: Array<{
      code: string;
      approved: boolean;
      alternateProcedure?: string;
      validityPeriod?: number;
      notes?: string;
    }>;
    denialReason?: string;
    additionalInfoRequired?: string[];
  };
}

export interface SikkaBenefitsUpdateEvent extends SikkaBaseEvent {
  eventType: "benefits.update";
  data: {
    patientId: string;
    insuranceId: string;
    updateDate: ISO8601String;
    changes: Array<{
      benefitType: string;
      field: string;
      oldValue: unknown;
      newValue: unknown;
      effectiveDate: ISO8601String;
    }>;
  };
}

export type SikkaWebhookEvent =
  | SikkaEligibilityVerifiedEvent
  | SikkaClaimStatusEvent
  | SikkaPreAuthStatusEvent
  | SikkaBenefitsUpdateEvent;

// OpenAI Webhook Types
export interface OpenAIBaseEvent {
  eventType: string;
  timestamp: ISO8601String;
  organizationId: string;
  modelId: string;
}

export interface OpenAICompletionEvent extends OpenAIBaseEvent {
  eventType: "completion.finished";
  data: {
    completionId: string;
    requestId: string;
    model: string;
    choices: Array<{
      text: string;
      index: number;
      finishReason: "stop" | "length" | "content_filter";
    }>;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
}

export interface OpenAIErrorEvent extends OpenAIBaseEvent {
  eventType: "error";
  data: {
    error: {
      code: string;
      message: string;
      type: string;
      param?: string;
    };
    requestId: string;
  };
}

export interface OpenAIModeratedEvent extends OpenAIBaseEvent {
  eventType: "moderation.flagged";
  data: {
    requestId: string;
    results: Array<{
      flagged: boolean;
      categories: Record<string, boolean>;
      categoryScores: Record<string, number>;
    }>;
  };
}

export type OpenAIWebhookEvent =
  | OpenAICompletionEvent
  | OpenAIErrorEvent
  | OpenAIModeratedEvent;

// Combined Webhook Type
export type WebhookEvent =
  | RetellWebhookEvent
  | SikkaWebhookEvent
  | OpenAIWebhookEvent;
