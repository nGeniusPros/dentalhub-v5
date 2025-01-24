export class PatientError extends Error {
  constructor(
    message: string,
    public readonly code: 'VALIDATION_ERROR' | 'DATABASE_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'PatientError';
  }
}