export declare class AgentError extends Error {
    code: string;
    metadata?: Record<string, unknown> | undefined;
    constructor(code: string, message: string, metadata?: Record<string, unknown> | undefined);
}
