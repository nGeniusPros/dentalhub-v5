export enum ErrorCode {
  // Authentication Errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  AUTH_SYSTEM_ERROR = 'AUTH_SYSTEM_ERROR',
  
  // Validation Errors
  INVALID_REQUEST_FORMAT = 'INVALID_REQUEST_FORMAT',
  
  // Database Errors
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR = 'DB_QUERY_ERROR',
  
  // API Errors
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // System Errors
  SERVER_ERROR = 'SERVER_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR'
}

export type ErrorResponse = {
  code: ErrorCode;
  message: string;
  docs?: string;
  resolution?: string;
  reference?: string;
  issues?: Array<{
    field: string;
    message: string;
  }>;
};