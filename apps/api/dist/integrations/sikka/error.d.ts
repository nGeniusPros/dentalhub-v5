interface ErrorDetails {
    status?: number;
    response?: any;
    originalError?: unknown;
    attempts?: number;
}
export declare class SikkaBaseError extends Error {
    readonly details?: ErrorDetails;
    readonly errorType: string;
    constructor(message: string, errorType: string, details?: ErrorDetails);
}
export declare class SikkaAuthenticationError extends SikkaBaseError {
    constructor(message: string, details?: ErrorDetails);
}
export declare class SikkaRateLimitError extends SikkaBaseError {
    constructor(message: string, details?: ErrorDetails);
}
export declare class SikkaTimeoutError extends SikkaBaseError {
    constructor(message: string, details?: ErrorDetails);
}
export declare class SikkaApiError extends SikkaBaseError {
    constructor(message: string, details?: ErrorDetails);
}
export declare function handleSikkaError(error: unknown): never;
export {};
