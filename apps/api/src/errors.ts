export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export class ErrorResponse extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly originalError?: unknown;

  constructor({
    message,
    code,
    statusCode = 500,
    originalError,
  }: {
    message: string;
    code: ErrorCode;
    statusCode?: number;
    originalError?: unknown;
  }) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = 'ErrorResponse'; // or specific error name
  }

  serializeErrorResponse() {
    return {
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500', // Generic error type
      title: 'Application error',
      status: this.statusCode,
      detail: this.message,
      errorCode: this.code,
    };
  }
}