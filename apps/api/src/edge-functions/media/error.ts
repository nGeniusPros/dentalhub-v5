import { MediaProcessingError } from './types';

export class MediaProcessingException extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'MediaProcessingException';
    this.code = code;
    this.details = details;
  }
}

export function handleMediaError(
  error: unknown,
  defaultCode: string = 'UNKNOWN_ERROR'
): MediaProcessingError {
  if (error instanceof MediaProcessingException) {
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
    message: 'An unexpected error occurred during media processing',
    details: error,
  };
}

// Error code mappings
export const ErrorCodes = {
  // Image processing errors
  IMAGE_PROCESSING_FAILED: 'image_processing_failed',
  INVALID_IMAGE_FORMAT: 'invalid_image_format',
  INVALID_IMAGE_SIZE: 'invalid_image_size',
  
  // Video processing errors
  VIDEO_PROCESSING_FAILED: 'video_processing_failed',
  INVALID_VIDEO_FORMAT: 'invalid_video_format',
  INVALID_VIDEO_SIZE: 'invalid_video_size',
  
  // Storage errors
  MEDIA_STORAGE_FAILED: 'media_storage_failed',
  STORAGE_CONFIGURATION_ERROR: 'storage_configuration_error',
  
  // General errors
  UNSUPPORTED_MEDIA_TYPE: 'unsupported_media_type',
  MEDIA_PROCESSING_FAILED: 'media_processing_failed',
  
  // System errors
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  TIMEOUT: 'timeout',
} as const;

export function isRetryableError(error: MediaProcessingError): boolean {
  const retryableCodes = new Set([
    'media_storage_failed',
    'service_unavailable',
    'timeout',
  ]);
  return retryableCodes.has(error.code);
}

export function createError(
  code: keyof typeof ErrorCodes,
  message: string,
  details?: any
): MediaProcessingException {
  return new MediaProcessingException(message, ErrorCodes[code], details);
}