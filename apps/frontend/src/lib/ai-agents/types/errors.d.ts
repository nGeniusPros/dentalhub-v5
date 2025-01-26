import { DentalAgentType } from "./agent-types";
export declare class AgentError extends Error {
  agentType: DentalAgentType;
  code: string;
  retryable: boolean;
  underlying?: Error | undefined;
  constructor(
    message: string,
    agentType: DentalAgentType,
    code: string,
    retryable: boolean,
    underlying?: Error | undefined,
  );
}
export declare class OpenAIError extends AgentError {
  status: number;
  constructor(
    message: string,
    agentType: DentalAgentType,
    code: OpenAIErrorCode,
    retryable: boolean,
    status: number,
    underlying?: Error,
  );
}
export declare enum OpenAIErrorCode {
  INVALID_AUTH = "invalid_authentication",
  INVALID_API_KEY = "invalid_api_key",
  NO_PERMISSION = "permission_denied",
  ORG_NOT_FOUND = "organization_not_found",
  RATE_LIMIT = "rate_limit_exceeded",
  QUOTA_EXCEEDED = "quota_exceeded",
  ENGINE_OVERLOADED = "server_overloaded",
  INVALID_REQUEST = "invalid_request",
  MODEL_NOT_FOUND = "model_not_found",
  VALIDATION_ERROR = "validation_error",
  CONTENT_POLICY = "content_policy_violation",
  MAX_TOKENS = "max_tokens_exceeded",
  CONTEXT_LENGTH = "context_length_exceeded",
  API_ERROR = "api_error",
  TIMEOUT = "timeout",
  SERVICE_UNAVAILABLE = "service_unavailable",
}
export declare enum SikkaErrorCode {
  INVALID_TOKEN = "invalid_token",
  TOKEN_EXPIRED = "token_expired",
  INVALID_CREDENTIALS = "invalid_credentials",
  UNAUTHORIZED = "unauthorized",
  INSUFFICIENT_SCOPE = "insufficient_scope",
  RESOURCE_NOT_FOUND = "resource_not_found",
  PRACTICE_NOT_FOUND = "practice_not_found",
  INVALID_PRACTICE_ID = "invalid_practice_id",
  API_RATE_LIMIT = "api_rate_limit",
  CONCURRENT_REQUEST_LIMIT = "concurrent_request_limit",
  INVALID_REQUEST = "invalid_request",
  INVALID_PARAMETERS = "invalid_parameters",
  VALIDATION_ERROR = "validation_error",
  SERVER_ERROR = "server_error",
  SERVICE_UNAVAILABLE = "service_unavailable",
  GATEWAY_TIMEOUT = "gateway_timeout",
}
export interface SikkaErrorDetails {
  requestId?: string;
  statusCode?: number;
  retryAfter?: number;
  path?: string;
  timestamp?: string;
  [key: string]: any;
}
export declare class SikkaApiError extends AgentError {
  details: SikkaErrorDetails;
  constructor(
    message: string,
    agentType: DentalAgentType,
    code: SikkaErrorCode,
    retryable: boolean,
    details: SikkaErrorDetails,
    underlying?: Error,
  );
}
export declare class SikkaAuthenticationError extends SikkaApiError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    details: SikkaErrorDetails,
    underlying?: Error,
  );
}
export declare class SikkaRateLimitError extends SikkaApiError {
  constructor(
    message: string,
    agentType: DentalAgentType,
    details: SikkaErrorDetails,
    underlying?: Error,
  );
}
export declare function isSikkaErrorRetryable(code: SikkaErrorCode): boolean;
export declare class NetworkError extends AgentError {
  constructor(agentType: DentalAgentType, message?: string, underlying?: Error);
}
export declare class RateLimitError extends AgentError {
  retryAfter?: number | undefined;
  constructor(
    agentType: DentalAgentType,
    retryAfter?: number | undefined,
    message?: string,
  );
}
export declare class ValidationError extends AgentError {
  field?: string | undefined;
  constructor(
    message: string,
    agentType: DentalAgentType,
    field?: string | undefined,
  );
}
export declare function isRetryableError(error: Error): boolean;
export declare function convertOpenAIError(
  error: any,
  agentType: DentalAgentType,
): AgentError;
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    details?: Record<string, any>;
  };
}
export declare function createErrorResponse(error: Error): ErrorResponse;
