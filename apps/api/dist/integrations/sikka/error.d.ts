import { DentalAgentType } from '@dental/core/ai/types';
import { SikkaApiError, SikkaErrorDetails } from '../../../../frontend/src/lib/ai-agents/types/errors';
export declare class SikkaAuthorizationError extends SikkaApiError {
    constructor(message: string, details: SikkaErrorDetails, underlying?: Error);
}
export declare class SikkaValidationError extends SikkaApiError {
    constructor(message: string, details: SikkaErrorDetails, underlying?: Error);
}
export declare class SikkaNotFoundError extends SikkaApiError {
    constructor(message: string, details: SikkaErrorDetails, underlying?: Error);
}
export declare class SikkaServerError extends SikkaApiError {
    constructor(message: string, details: SikkaErrorDetails, underlying?: Error);
}
export declare class SikkaNetworkError extends SikkaApiError {
    constructor(message: string, details?: SikkaErrorDetails, underlying?: Error);
}
export declare class SikkaError extends Error {
    readonly agentType: DentalAgentType;
    readonly cause?: unknown | undefined;
    constructor(message: string, agentType: DentalAgentType, cause?: unknown | undefined);
}
export declare function handleSikkaError(error: unknown): never;
