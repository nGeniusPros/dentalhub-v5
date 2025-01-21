import { AxiosError } from 'axios';
import { RetellApiError } from './types';
import { createHmac, timingSafeEqual } from 'crypto';

export class RetellIntegrationError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'RetellIntegrationError';
    this.code = code;
    this.details = details;
  }
}

export function handleRetellError(error: unknown): never {
  if (error instanceof AxiosError) {
    const retellError: RetellApiError = error.response?.data?.error || {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred with the Retell API',
    };

    throw new RetellIntegrationError(
      retellError.message,
      retellError.code,
      retellError.details
    );
  }

  if (error instanceof Error) {
    throw new RetellIntegrationError(
      error.message,
      'INTERNAL_ERROR',
      { originalError: error }
    );
  }

  throw new RetellIntegrationError(
    'An unexpected error occurred',
    'UNEXPECTED_ERROR',
    { originalError: error }
  );
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof RetellIntegrationError) {
    const retryableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'RATE_LIMIT_ERROR',
      'SERVICE_UNAVAILABLE',
      'CALL_FAILED',
      'TRANSCRIPTION_FAILED',
      'ANALYSIS_FAILED'
    ];
    return retryableCodes.includes(error.code);
  }
  return false;
}

export function validateWebhookSignature(
  signature: string,
  body: string,
  secret: string
): boolean {
  try {
    // In a real implementation, this would use crypto to validate
    // the webhook signature using HMAC
    const hmac = createHmac('sha256', secret);
    const calculatedSignature = hmac.update(body).digest('hex');
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
  } catch (error) {
    throw new RetellIntegrationError(
      'Failed to validate webhook signature',
      'INVALID_SIGNATURE',
      { error }
    );
  }
}

export function handleWebhookError(error: unknown): RetellApiError {
  if (error instanceof RetellIntegrationError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'WEBHOOK_ERROR',
      message: error.message,
      details: { name: error.name },
    };
  }

  return {
    code: 'UNKNOWN_WEBHOOK_ERROR',
    message: 'An unknown error occurred processing the webhook',
    details: { error },
  };
}

// Error code mappings for better error handling
export const ErrorCodes = {
  // Authentication errors
  INVALID_API_KEY: 'invalid_api_key',
  EXPIRED_API_KEY: 'expired_api_key',
  
  // Call errors
  INVALID_PHONE_NUMBER: 'invalid_phone_number',
  CALL_FAILED: 'call_failed',
  CALL_TIMEOUT: 'call_timeout',
  
  // Transcription errors
  TRANSCRIPTION_FAILED: 'transcription_failed',
  INVALID_AUDIO: 'invalid_audio',
  
  // Analysis errors
  ANALYSIS_FAILED: 'analysis_failed',
  INVALID_TRANSCRIPT: 'invalid_transcript',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  
  // Webhook errors
  INVALID_SIGNATURE: 'invalid_signature',
  WEBHOOK_TIMEOUT: 'webhook_timeout',
  
  // System errors
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
} as const;