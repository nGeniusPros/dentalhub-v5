import { NotificationError } from './types';

export class NotificationException extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'NotificationException';
    this.code = code;
    this.details = details;
  }
}

export function handleNotificationError(
  error: unknown,
  defaultCode: string = 'UNKNOWN_ERROR'
): NotificationError {
  if (error instanceof NotificationException) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: defaultCode,
      message: error.message,
      details: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    };
  }

  return {
    code: defaultCode,
    message: 'An unexpected error occurred during notification sending',
    details: error,
  };
}

// Error code mappings
export const ErrorCodes = {
  // Email errors
  EMAIL_SEND_FAILED: 'email_send_failed',
  EMAIL_CONFIG_ERROR: 'email_config_error',
  INVALID_EMAIL_ADDRESS: 'invalid_email_address',
  
  // SMS errors
  SMS_SEND_FAILED: 'sms_send_failed',
  SMS_CONFIG_ERROR: 'sms_config_error',
  INVALID_PHONE_NUMBER: 'invalid_phone_number',
  
  // General errors
  UNSUPPORTED_NOTIFICATION_TYPE: 'unsupported_notification_type',
  NOTIFICATION_SEND_FAILED: 'notification_send_failed',
  
  // System errors
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  TIMEOUT: 'timeout',
} as const;

export function isRetryableError(error: NotificationError): boolean {
  const retryableCodes = new Set([
    'email_send_failed',
    'sms_send_failed',
    'service_unavailable',
    'timeout',
  ]);
  return retryableCodes.has(error.code);
}

export function createError(
  code: keyof typeof ErrorCodes,
  message: string,
  details?: any
): NotificationException {
  return new NotificationException(message, ErrorCodes[code], details);
}