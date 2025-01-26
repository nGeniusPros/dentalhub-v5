export interface SikkaVerifyInsuranceResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface SikkaCheckEligibilityResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface SikkaVerifyBenefitsResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface SikkaProcessClaimResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface RetellCallStatusResponse {
  status: string;
  duration?: number;
  transcript?: string;
  message?: string;
}

export interface RetellTranscriptionResponse {
  transcription: string;
  message?: string;
}

export interface RetellAnalysisResponse {
  analysis: any;
  message?: string;
}

export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

// Error Types
export class ExternalServiceError extends Error {
  constructor(
    public service: "sikka" | "retell" | "openai",
    public statusCode: number,
    message: string,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ExternalServiceError";
  }
}

export class RateLimitError extends ExternalServiceError {
  constructor(
    service: "sikka" | "retell" | "openai",
    public retryAfter?: number,
  ) {
    super(service, 429, "Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export class AuthenticationError extends ExternalServiceError {
  constructor(
    service: "sikka" | "retell" | "openai",
    details?: Record<string, any>,
  ) {
    super(service, 401, "Authentication failed", details);
    this.name = "AuthenticationError";
  }
}
