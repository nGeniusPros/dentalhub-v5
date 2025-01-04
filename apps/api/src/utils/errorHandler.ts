import { Response } from 'express';
import { SikkaIntegrationError } from '../integrations/sikka/error';

interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}

export function handleError(error: unknown, res: Response): void {
  console.error('API Error:', error);

  if (error instanceof SikkaIntegrationError) {
    res.status(getStatusCodeForError(error.code)).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        details: {
          name: error.name,
          message: error.message,
        },
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
    },
  });
}

function getStatusCodeForError(code: string): number {
  const statusCodes: Record<string, number> = {
    'VALIDATION_ERROR': 400,
    'AUTHENTICATION_ERROR': 401,
    'AUTHORIZATION_ERROR': 403,
    'NOT_FOUND': 404,
    'RATE_LIMIT_ERROR': 429,
    'SERVICE_UNAVAILABLE': 503,
  };

  return statusCodes[code] || 500;
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: any
): ErrorResponse {
  return {
    code,
    message,
    ...(details && { details }),
  };
}

export function isOperationalError(error: unknown): boolean {
  if (error instanceof SikkaIntegrationError) {
    // List of error codes that are considered operational
    const operationalCodes = [
      'VALIDATION_ERROR',
      'AUTHENTICATION_ERROR',
      'AUTHORIZATION_ERROR',
      'NOT_FOUND',
      'RATE_LIMIT_ERROR',
    ];
    return operationalCodes.includes(error.code);
  }
  return false;
}