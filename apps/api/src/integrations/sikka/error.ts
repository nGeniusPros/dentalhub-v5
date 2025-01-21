import { AxiosError } from 'axios';
import { SikkaApiError } from './types';

interface ErrorDetails {
  status?: number;
  response?: any;
  originalError?: unknown;
  [key: string]: any;
}

export class SikkaIntegrationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = 'SikkaIntegrationError';
  }
}

export class SikkaAuthenticationError extends SikkaIntegrationError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'AUTHENTICATION_ERROR', details);
    this.name = 'SikkaAuthenticationError';
  }
}

export class SikkaValidationError extends SikkaIntegrationError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'SikkaValidationError';
  }
}

export class SikkaRateLimitError extends SikkaIntegrationError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RATE_LIMIT_ERROR', details);
    this.name = 'SikkaRateLimitError';
  }
}

export class SikkaNetworkError extends SikkaIntegrationError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'SikkaNetworkError';
  }
}

export class SikkaTimeoutError extends SikkaIntegrationError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'TIMEOUT_ERROR', details);
    this.name = 'SikkaTimeoutError';
  }
}

export function handleSikkaError(error: unknown): never {
  if (error instanceof AxiosError) {
    const errorDetails: ErrorDetails = {
      status: error.response?.status,
      response: error.response?.data,
      headers: error.response?.headers
    };

    console.log('Sikka API Error Response:', errorDetails);

    const status = error.response?.status;
    const sikkaError: SikkaApiError = error.response?.data?.error || {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred with the Sikka API',
    };

    // Handle specific error types
    if (status === 401 || status === 403) {
      throw new SikkaAuthenticationError(sikkaError.message, errorDetails);
    }

    if (status === 422) {
      throw new SikkaValidationError(sikkaError.message, errorDetails);
    }

    if (status === 429) {
      throw new SikkaRateLimitError(sikkaError.message, errorDetails);
    }

    if (error.code === 'ECONNABORTED') {
      throw new SikkaTimeoutError('Request timed out', errorDetails);
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new SikkaNetworkError('Network connection failed', errorDetails);
    }

    throw new SikkaIntegrationError(
      sikkaError.message,
      sikkaError.code,
      errorDetails
    );
  }

  if (error instanceof Error) {
    throw new SikkaIntegrationError(
      error.message,
      'INTERNAL_ERROR',
      { originalError: error }
    );
  }

  throw new SikkaIntegrationError(
    'An unexpected error occurred',
    'UNEXPECTED_ERROR',
    { originalError: error }
  );
}

export function isRetryableError(error: unknown): boolean {
  return (
    error instanceof SikkaRateLimitError ||
    error instanceof SikkaNetworkError ||
    error instanceof SikkaTimeoutError ||
    (error instanceof SikkaIntegrationError &&
      error.code === 'SERVICE_UNAVAILABLE')
  );
}