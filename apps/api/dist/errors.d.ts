export declare enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    UNAUTHORIZED = "UNAUTHORIZED"
}
export declare class ErrorResponse extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    readonly originalError?: unknown;
    constructor({ message, code, statusCode, originalError, }: {
        message: string;
        code: ErrorCode;
        statusCode?: number;
        originalError?: unknown;
    });
    serializeErrorResponse(): {
        type: string;
        title: string;
        status: number;
        detail: string;
        errorCode: ErrorCode;
    };
}
