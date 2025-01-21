export declare class SikkaIntegrationError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleSikkaError(error: unknown): never;
export declare function isRetryableError(error: unknown): boolean;
