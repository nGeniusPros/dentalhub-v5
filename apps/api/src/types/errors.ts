export enum ErrorCode {
  UNAUTHORIZED = 'AUTH_001',
  FORBIDDEN = 'AUTH_002',
  INTERNAL_ERROR = 'SRV_001',
  INVALID_INPUT = 'VAL_001',
  NOT_FOUND = 'SRV_002'
}

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}