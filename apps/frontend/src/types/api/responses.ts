import type {
  SikkaVerifyInsuranceResponse,
  SikkaCheckEligibilityResponse,
  SikkaVerifyBenefitsResponse,
  SikkaProcessClaimResponse,
  SikkaErrorDetails,
} from "@dentalhub/types/sikka";

import type {
  RetellCallStatusResponse,
  RetellTranscriptionResponse,
  RetellAnalysisResponse,
  RetellErrorDetails,
} from "@dentalhub/types/retell";

export type {
  SikkaVerifyInsuranceResponse,
  SikkaCheckEligibilityResponse,
  SikkaVerifyBenefitsResponse,
  SikkaProcessClaimResponse,
  RetellCallStatusResponse,
  RetellTranscriptionResponse,
  RetellAnalysisResponse,
};

export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message?: {
      role: "assistant" | "user" | "system";
      content?: string | null;
    };
    text?: string;
    index: number;
    logprobs: null | {
      tokens: string[];
      token_logprobs: number[];
      top_logprobs: Array<Record<string, number>>;
      text_offset: number[];
    };
    finish_reason: "stop" | "length" | "content_filter" | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ExternalServiceError {
  service: string;
  statusCode: number | undefined;
  message: string;
  details: SikkaErrorDetails | RetellErrorDetails | Record<string, unknown>;
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}
