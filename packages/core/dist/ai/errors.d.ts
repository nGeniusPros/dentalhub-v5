export declare class AiServiceError extends Error {
    readonly cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
export declare class RateLimitError extends Error {
    constructor(message: string);
}
