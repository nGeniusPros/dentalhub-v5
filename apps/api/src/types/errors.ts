export enum ErrorCode {
  // Authentication Errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",

  // Request Validation Errors
  INVALID_REQUEST_FORMAT = "INVALID_REQUEST_FORMAT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
  INVALID_FIELD_FORMAT = "INVALID_FIELD_FORMAT",
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // Webhook Errors
  INVALID_WEBHOOK_SIGNATURE = "INVALID_WEBHOOK_SIGNATURE",
  INVALID_WEBHOOK_TIMESTAMP = "INVALID_WEBHOOK_TIMESTAMP",
  INVALID_WEBHOOK_EVENT = "INVALID_WEBHOOK_EVENT",

  // Resource Errors
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",

  // Database Errors
  DATABASE_ERROR = "DATABASE_ERROR",
  QUERY_ERROR = "QUERY_ERROR",

  // Storage Errors
  STORAGE_ERROR = "STORAGE_ERROR",
  FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",

  // External API Errors
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  API_RESPONSE_ERROR = "API_RESPONSE_ERROR",
  API_TIMEOUT_ERROR = "API_TIMEOUT_ERROR",

  // Server Errors
  SERVER_ERROR = "SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // Unknown Error
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export type ErrorCodeType = `${ErrorCode}`;

export interface ErrorResponse {
  code: ErrorCodeType;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export class ServiceError extends Error {
  readonly code: ErrorCodeType;
  readonly statusCode?: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCodeType,
    message: string,
    details?: Record<string, unknown>,
    statusCode?: number
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }

  toJSON(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCode.UNAUTHORIZED]: "You are not authorized to perform this action",
  [ErrorCode.TOKEN_EXPIRED]: "Authentication token has expired",
  [ErrorCode.INVALID_TOKEN]: "Invalid authentication token",

  [ErrorCode.INVALID_REQUEST_FORMAT]: "Invalid request format",
  [ErrorCode.MISSING_REQUIRED_FIELD]: "Required field is missing",
  [ErrorCode.INVALID_FIELD_FORMAT]: "Field format is invalid",
  [ErrorCode.VALIDATION_ERROR]: "Validation error occurred",

  [ErrorCode.INVALID_WEBHOOK_SIGNATURE]: "Invalid webhook signature",
  [ErrorCode.INVALID_WEBHOOK_TIMESTAMP]: "Invalid webhook timestamp",
  [ErrorCode.INVALID_WEBHOOK_EVENT]: "Invalid webhook event",

  [ErrorCode.RESOURCE_NOT_FOUND]: "Resource not found",
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: "Resource already exists",
  [ErrorCode.RESOURCE_CONFLICT]: "Resource conflict",

  [ErrorCode.DATABASE_ERROR]: "Database error occurred",
  [ErrorCode.QUERY_ERROR]: "Query error occurred",

  [ErrorCode.STORAGE_ERROR]: "Storage error occurred",
  [ErrorCode.FILE_UPLOAD_ERROR]: "File upload error occurred",

  [ErrorCode.EXTERNAL_API_ERROR]: "External API error occurred",
  [ErrorCode.API_RESPONSE_ERROR]: "Invalid API response",
  [ErrorCode.API_TIMEOUT_ERROR]: "API request timed out",

  [ErrorCode.SERVER_ERROR]: "Internal server error",
  [ErrorCode.SERVICE_UNAVAILABLE]: "Service is currently unavailable",
  [ErrorCode.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",

  [ErrorCode.UNKNOWN_ERROR]: "An unknown error occurred"
};
