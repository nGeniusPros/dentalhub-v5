import { MediaProcessingError } from './types';
export declare class MediaProcessingException extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleMediaError(error: unknown, defaultCode?: string): MediaProcessingError;
export declare const ErrorCodes: {
    readonly IMAGE_PROCESSING_FAILED: "image_processing_failed";
    readonly INVALID_IMAGE_FORMAT: "invalid_image_format";
    readonly INVALID_IMAGE_SIZE: "invalid_image_size";
    readonly VIDEO_PROCESSING_FAILED: "video_processing_failed";
    readonly INVALID_VIDEO_FORMAT: "invalid_video_format";
    readonly INVALID_VIDEO_SIZE: "invalid_video_size";
    readonly MEDIA_STORAGE_FAILED: "media_storage_failed";
    readonly STORAGE_CONFIGURATION_ERROR: "storage_configuration_error";
    readonly UNSUPPORTED_MEDIA_TYPE: "unsupported_media_type";
    readonly MEDIA_PROCESSING_FAILED: "media_processing_failed";
    readonly INTERNAL_ERROR: "internal_error";
    readonly SERVICE_UNAVAILABLE: "service_unavailable";
    readonly TIMEOUT: "timeout";
};
export declare function isRetryableError(error: MediaProcessingError): boolean;
export declare function createError(code: keyof typeof ErrorCodes, message: string, details?: any): MediaProcessingException;
