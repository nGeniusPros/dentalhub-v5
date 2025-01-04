import { AxiosError } from 'axios';
import { SikkaApiError } from './types';

export class SikkaIntegrationError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'SikkaIntegrationError';
    this.code = code;
    this.details = details;
  }
}

export function handleSikkaError(error: unknown): never {
  if (error instanceof AxiosError) {
    const sikkaError: SikkaApiError = error.response?.data?.error || {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred with the Sikka API',
    };

    throw new SikkaIntegrationError(
      sikkaError.message,
      sikkaError.code,
      sikkaError.details
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
  if (error instanceof SikkaIntegrationError) {
    const retryableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'RATE_LIMIT_ERROR',
      'SERVICE_UNAVAILABLE'
    ];
    return retryableCodes.includes(error.code);
  }
  return false;
}