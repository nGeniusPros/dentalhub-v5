import { DentalAgentType } from './agent-types';

// Base error class for all AI agent errors
export class AgentError extends Error {
  constructor(
    message: string,
    public agentType: DentalAgentType,
    public code: string,
    public retryable: boolean,
    public underlying?: Error
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

// OpenAI specific error types
export class OpenAIError extends AgentError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    code: OpenAIErrorCode,
    retryable: boolean,
    public status: number,
    underlying?: Error
  ) {
    super(message, agentType, code, retryable, underlying);
    this.name = 'OpenAIError';
  }
}

// OpenAI error codes based on their API documentation
export enum OpenAIErrorCode {
  // Authentication/Authorization
  INVALID_AUTH = 'invalid_authentication',
  INVALID_API_KEY = 'invalid_api_key',
  NO_PERMISSION = 'permission_denied',
  ORG_NOT_FOUND = 'organization_not_found',

  // Rate Limits
  RATE_LIMIT = 'rate_limit_exceeded',
  QUOTA_EXCEEDED = 'quota_exceeded',
  ENGINE_OVERLOADED = 'server_overloaded',

  // Invalid Requests
  INVALID_REQUEST = 'invalid_request',
  MODEL_NOT_FOUND = 'model_not_found',
  VALIDATION_ERROR = 'validation_error',
  CONTENT_POLICY = 'content_policy_violation',
  MAX_TOKENS = 'max_tokens_exceeded',
  CONTEXT_LENGTH = 'context_length_exceeded',

  // Server Errors
  API_ERROR = 'api_error',
  TIMEOUT = 'timeout',
  SERVICE_UNAVAILABLE = 'service_unavailable'
}

// Sikka API specific error codes
export enum SikkaErrorCode {
  // Authentication
  INVALID_TOKEN = 'invalid_token',
  TOKEN_EXPIRED = 'token_expired',
  INVALID_CREDENTIALS = 'invalid_credentials',
  
  // Authorization
  UNAUTHORIZED = 'unauthorized',
  INSUFFICIENT_SCOPE = 'insufficient_scope',
  
  // Resource Errors
  RESOURCE_NOT_FOUND = 'resource_not_found',
  PRACTICE_NOT_FOUND = 'practice_not_found',
  INVALID_PRACTICE_ID = 'invalid_practice_id',
  
  // Rate Limiting
  API_RATE_LIMIT = 'api_rate_limit',
  CONCURRENT_REQUEST_LIMIT = 'concurrent_request_limit',
  
  // Request Errors
  INVALID_REQUEST = 'invalid_request',
  INVALID_PARAMETERS = 'invalid_parameters',
  VALIDATION_ERROR = 'validation_error',
  
  // Server Errors
  SERVER_ERROR = 'server_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  GATEWAY_TIMEOUT = 'gateway_timeout'
}

// Sikka API error interface
export interface SikkaErrorDetails {
  requestId?: string;
  statusCode?: number;
  retryAfter?: number;
  path?: string;
  timestamp?: string;
  [key: string]: any;
}

// Sikka API error class
export class SikkaApiError extends AgentError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    code: SikkaErrorCode,
    retryable: boolean,
    public details: SikkaErrorDetails,
    underlying?: Error
  ) {
    super(message, agentType, code, retryable, underlying);
    this.name = 'SikkaApiError';
  }
}

// Specific Sikka error types
export class SikkaAuthenticationError extends SikkaApiError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    details: SikkaErrorDetails,
    underlying?: Error
  ) {
    super(
      message,
      agentType,
      SikkaErrorCode.INVALID_TOKEN,
      false,
      details,
      underlying
    );
    this.name = 'SikkaAuthenticationError';
  }
}

export class SikkaRateLimitError extends SikkaApiError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    details: SikkaErrorDetails,
    underlying?: Error
  ) {
    super(
      message,
      agentType,
      SikkaErrorCode.API_RATE_LIMIT,
      true,
      details,
      underlying
    );
    this.name = 'SikkaRateLimitError';
  }
}

// Helper function to determine if a Sikka error is retryable
export function isSikkaErrorRetryable(code: SikkaErrorCode): boolean {
  return [
    SikkaErrorCode.API_RATE_LIMIT,
    SikkaErrorCode.CONCURRENT_REQUEST_LIMIT,
    SikkaErrorCode.SERVICE_UNAVAILABLE,
    SikkaErrorCode.GATEWAY_TIMEOUT,
    SikkaErrorCode.SERVER_ERROR
  ].includes(code);
}

// Network related errors
export class NetworkError extends AgentError {
  constructor(
    agentType: DentalAgentType,
    message: string = 'Network request failed',
    underlying?: Error
  ) {
    super(message, agentType, 'NETWORK_ERROR', true, underlying);
    this.name = 'NetworkError';
  }
}

// Rate limiting errors
export class RateLimitError extends AgentError {
  constructor(
    agentType: DentalAgentType,
    public retryAfter?: number,
    message: string = 'Rate limit exceeded'
  ) {
    super(message, agentType, 'RATE_LIMIT', true);
    this.name = 'RateLimitError';
  }
}

// Validation errors
export class ValidationError extends AgentError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    public field?: string
  ) {
    super(message, agentType, 'VALIDATION_ERROR', false);
    this.name = 'ValidationError';
  }
}

// Helper function to determine if an error is retryable
export function isRetryableError(error: Error): boolean {
  if (error instanceof AgentError) {
    return error.retryable;
  }
  // Network errors are generally retryable
  return error instanceof TypeError || error.name === 'NetworkError';
}

// Helper function to convert OpenAI API errors
export function convertOpenAIError(
  error: any,
  agentType: DentalAgentType
): AgentError {
  if (!error.response) {
    return new NetworkError(agentType, error.message, error);
  }

  const { status, data } = error.response;
  const code = data?.error?.code || data?.error?.type;
  const message = data?.error?.message || 'Unknown OpenAI error';

  // Determine if the error is retryable
  const retryable = status === 429 || status >= 500;

  switch (code) {
    case 'rate_limit_exceeded':
      return new RateLimitError(
        agentType,
        parseInt(error.response.headers['retry-after']),
        message
      );
    
    case 'invalid_api_key':
    case 'permission_denied':
      return new OpenAIError(
        message,
        agentType,
        code as OpenAIErrorCode,
        false,
        status,
        error
      );
    
    case 'context_length_exceeded':
    case 'max_tokens_exceeded':
      return new ValidationError(message, agentType, 'tokens');
    
    default:
      return new OpenAIError(
        message,
        agentType,
        (code as OpenAIErrorCode) || OpenAIErrorCode.API_ERROR,
        retryable,
        status,
        error
      );
  }
}

// Helper to create error response objects
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    details?: Record<string, any>;
  };
}

export function createErrorResponse(error: Error): ErrorResponse {
  if (error instanceof AgentError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        retryable: error.retryable,
        details: error instanceof OpenAIError ? { status: error.status } : undefined
      }
    };
  }
  
  return {
    error: {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      retryable: isRetryableError(error)
    }
  };
}
