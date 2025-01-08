import { AxiosError } from 'axios';

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function handleError(error: any, defaultMessage: string): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const code = error.response?.status?.toString() || 'API_ERROR';
    const message = error.response?.data?.message || error.message || defaultMessage;
    const details = error.response?.data?.details;
    return new ApiError(message, code, details);
  }

  return new ApiError(defaultMessage, 'UNKNOWN_ERROR', error);
}