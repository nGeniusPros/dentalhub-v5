export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INFRASTRUCTURE_ERROR = 'INFRASTRUCTURE_ERROR',
}

export abstract class DentalError extends Error {
  abstract code: ErrorCode;
  abstract statusCode: number;
  abstract details?: Record<string, unknown>;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      type: `https://docs.dentalhub.com/errors/${this.code}`,
      title: this.message,
      status: this.statusCode,
      code: this.code,
      details: this.details,
      timestamp: new Date().toISOString()
    };
  }
}

export class InfrastructureError extends DentalError {
  code = ErrorCode.INFRASTRUCTURE_ERROR;
  statusCode = 500;
  details?: Record<string, unknown>;

  constructor(
    public operation: string,
    public originalError: unknown,
    details?: Record<string, unknown>
  ) {
    super(`Infrastructure failure during ${operation}`);
    this.details = {
      ...details,
      originalError: this.safeSerializeError(originalError)
    };
  }

  private safeSerializeError(err: unknown) {
    return err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack }
      : err;
  }
}