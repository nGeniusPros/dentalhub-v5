export type SikkaVerifyInsuranceResponse = {
  status: string;
  message?: string;
  data?: any;
};

export type SikkaCheckEligibilityResponse = {
    status: string;
    message?: string;
    data?: any;
  };

export type SikkaVerifyBenefitsResponse = {
    status: string;
    message?: string;
    data?: any;
  };

export type SikkaProcessClaimResponse = {
    status: string;
    message?: string;
    data?: any;
  };

export type RetellCallStatusResponse = {
  status: string;
  message?: string;
  data?: any;
};

export type RetellTranscriptionResponse = {
  transcription: string;
  message?: string;
  data?: any;
};

export type RetellAnalysisResponse = {
  analysis: any;
  message?: string;
  data?: any;
};

export type OpenAICompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message?: {
      content?: string | null;
    };
  }[];
};

export type ExternalServiceError = {
  service: string;
  statusCode: number | undefined;
  message: string;
  details: any;
};

export type RateLimitError = {
  message: string;
};

export type AuthenticationError = {
  message: string;
};