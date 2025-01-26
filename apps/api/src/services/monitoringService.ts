import { ErrorCode } from '../types/errors';

export class MonitoringService {
  static async logError(error: Error, code: ErrorCode, context?: Record<string, unknown>): Promise<void> {
    console.error('Error:', {
      message: error.message,
      code,
      stack: error.stack,
      context
    });
  }
}
