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

  // Server Errors
  SERVER_ERROR = "SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}

export type ErrorCodeType = `${ErrorCode}`;

export interface ErrorResponse {
  code: ErrorCodeType;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCode.UNAUTHORIZED]: "You are not authorized to perform this action",
  [ErrorCode.TOKEN_EXPIRED]: "Authentication token has expired",
  [ErrorCode.INVALID_TOKEN]: "Invalid authentication token",

  [ErrorCode.INVALID_REQUEST_FORMAT]: "Invalid request format",
  [ErrorCode.MISSING_REQUIRED_FIELD]: "Required field is missing",
  [ErrorCode.INVALID_FIELD_FORMAT]: "Field format is invalid",

  [ErrorCode.INVALID_WEBHOOK_SIGNATURE]: "Invalid webhook signature",
  [ErrorCode.INVALID_WEBHOOK_TIMESTAMP]: "Invalid webhook timestamp",
  [ErrorCode.INVALID_WEBHOOK_EVENT]: "Invalid webhook event type",

  [ErrorCode.RESOURCE_NOT_FOUND]: "Requested resource was not found",
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: "Resource already exists",
  [ErrorCode.RESOURCE_CONFLICT]: "Resource state conflict",

  [ErrorCode.DATABASE_ERROR]: "Database operation failed",
  [ErrorCode.QUERY_ERROR]: "Database query error",

  [ErrorCode.SERVER_ERROR]: "Internal server error",
  [ErrorCode.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable",
  [ErrorCode.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",
};
