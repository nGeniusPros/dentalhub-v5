export declare class InfrastructureError extends Error {
    readonly code: string;
    readonly metadata?: Record<string, any>;
    readonly cause?: Error | null;
    constructor(code: string, cause?: Error | null, metadata?: Record<string, any>);
}
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare class AuthenticationError extends Error {
    constructor(message: string);
}
export declare class AuthorizationError extends Error {
    constructor(message: string);
}
export declare class NotFoundError extends Error {
    constructor(message: string);
}
export declare class ConflictError extends Error {
    constructor(message: string);
}
