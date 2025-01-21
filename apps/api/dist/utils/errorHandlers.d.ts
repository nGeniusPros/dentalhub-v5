export declare class ApiError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleError(error: any, defaultMessage: string): ApiError;
