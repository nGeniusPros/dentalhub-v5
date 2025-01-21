import { DocumentGenerationError } from './types';
export declare class DocumentGenerationException extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleDocumentError(error: unknown, defaultCode?: string): DocumentGenerationError;
export declare const ErrorCodes: {
    readonly TEMPLATE_NOT_FOUND: "template_not_found";
    readonly TEMPLATE_INVALID: "template_invalid";
    readonly TEMPLATE_RETRIEVAL_FAILED: "template_retrieval_failed";
    readonly PDF_GENERATION_FAILED: "pdf_generation_failed";
    readonly DOCX_GENERATION_FAILED: "docx_generation_failed";
    readonly UNSUPPORTED_FORMAT: "unsupported_format";
    readonly INVALID_DATA: "invalid_data";
    readonly DOCUMENT_STORAGE_FAILED: "document_storage_failed";
    readonly STORAGE_CONFIGURATION_ERROR: "storage_configuration_error";
    readonly PROCESSING_ERROR: "processing_error";
    readonly RESOURCE_EXHAUSTED: "resource_exhausted";
    readonly TIMEOUT: "timeout";
    readonly INTERNAL_ERROR: "internal_error";
    readonly SERVICE_UNAVAILABLE: "service_unavailable";
};
export declare function isRetryableError(error: DocumentGenerationError): boolean;
export declare function createError(code: keyof typeof ErrorCodes, message: string, details?: any): DocumentGenerationException;
