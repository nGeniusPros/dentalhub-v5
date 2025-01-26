import { toast } from '../components/ui/toast';
import { ValidationError } from './validation';
import { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleError = (error: unknown): void => {
  if (error instanceof ValidationError) {
    const errors = error.errors.errors.map((e) => e.message).join(', ');
    toast.error(`Validation Error: ${errors}`);
    return;
  }

  if (error instanceof ApiError) {
    toast.error(`API Error: ${error.message}`);
    return;
  }

  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    toast.error(`Request Failed: ${message}`);
    return;
  }

  if (error instanceof Error) {
    toast.error(`Error: ${error.message}`);
    return;
  }

  toast.error('An unexpected error occurred');
};

export const createErrorHandler = (context: string) => (error: unknown) => {
  console.error(`Error in ${context}:`, error);
  handleError(error);
};

export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      createErrorHandler(context)(error);
      throw error;
    }
  };
};
