export const SIKKA_API_URL = process.env.SIKKA_API_URL || 'https://api.sikkasoft.com/v2';
export const SIKKA_API_KEY = process.env.SIKKA_API_KEY || '';
export const SIKKA_PRACTICE_ID = process.env.SIKKA_PRACTICE_ID || '';

// Error Codes
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Sikka API Endpoints
export const SIKKA_ENDPOINTS = {
  PATIENTS: (practiceId: string) => `/practices/${practiceId}/patients`,
  PATIENT_DETAILS: (practiceId: string, patientId: string) => `/practices/${practiceId}/patients/${patientId}`,
};
