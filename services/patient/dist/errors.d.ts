export declare class PatientError extends Error {
    readonly code: 'VALIDATION_ERROR' | 'DATABASE_ERROR';
    readonly details?: unknown;
    constructor(message: string, code: 'VALIDATION_ERROR' | 'DATABASE_ERROR', details?: unknown);
}
