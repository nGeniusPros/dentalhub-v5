import { DocumentGenerationError } from './types';

export class DocumentGenerationException extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'DocumentGenerationException';
    this.code = code;
    this.details = details;
  }
}

export function handleDocumentError(
  error: unknown,
  defaultCode: string = 'UNKNOWN_ERROR'
): DocumentGenerationError {
  if (error instanceof DocumentGenerationException) {
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
    message: 'An unexpected error occurred during document generation',
    details: error,
  };
}

// Error code mappings
export const ErrorCodes = {
  // Template errors
  TEMPLATE_NOT_FOUND: 'template_not_found',
  TEMPLATE_INVALID: 'template_invalid',
  TEMPLATE_RETRIEVAL_FAILED: 'template_retrieval_failed',
  
  // Generation errors
  PDF_GENERATION_FAILED: 'pdf_generation_failed',
  DOCX_GENERATION_FAILED: 'docx_generation_failed',
  UNSUPPORTED_FORMAT: 'unsupported_format',
  INVALID_DATA: 'invalid_data',
  
  // Storage errors
  DOCUMENT_STORAGE_FAILED: 'document_storage_failed',
  STORAGE_CONFIGURATION_ERROR: 'storage_configuration_error',
  
  // Processing errors
  PROCESSING_ERROR: 'processing_error',
  RESOURCE_EXHAUSTED: 'resource_exhausted',
  TIMEOUT: 'timeout',
  
  // System errors
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
} as const;

export function isRetryableError(error: DocumentGenerationError): boolean {
  const retryableCodes = new Set([
    'document_storage_failed',
    'service_unavailable',
    'resource_exhausted',
    'timeout',
  ]);
  return retryableCodes.has(error.code);
}

export function createError(
  code: keyof typeof ErrorCodes,
  message: string,
  details?: any
): DocumentGenerationException {
  return new DocumentGenerationException(message, ErrorCodes[code], details);
}