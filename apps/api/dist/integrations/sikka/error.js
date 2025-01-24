import { AxiosError } from 'axios';
import { DentalAgentType } from '@dental/core/ai/types';
import { SikkaErrorCode, SikkaApiError, SikkaAuthenticationError, SikkaRateLimitError } from '../../../../frontend/src/lib/ai-agents/types/errors';
// Base Sikka error classes for backend
export class SikkaAuthorizationError extends SikkaApiError {
    constructor(message, details, underlying) {
        super(message, DentalAgentType.SIKKA, SikkaErrorCode.UNAUTHORIZED, false, details, underlying);
        this.name = 'SikkaAuthorizationError';
    }
}
export class SikkaValidationError extends SikkaApiError {
    constructor(message, details, underlying) {
        super(message, DentalAgentType.SIKKA, SikkaErrorCode.VALIDATION_ERROR, false, details, underlying);
        this.name = 'SikkaValidationError';
    }
}
export class SikkaNotFoundError extends SikkaApiError {
    constructor(message, details, underlying) {
        super(message, DentalAgentType.SIKKA, SikkaErrorCode.RESOURCE_NOT_FOUND, false, details, underlying);
        this.name = 'SikkaNotFoundError';
    }
}
export class SikkaServerError extends SikkaApiError {
    constructor(message, details, underlying) {
        super(message, DentalAgentType.SIKKA, SikkaErrorCode.SERVER_ERROR, true, details, underlying);
        this.name = 'SikkaServerError';
    }
}
export class SikkaNetworkError extends SikkaApiError {
    constructor(message, details = {}, underlying) {
        super(message, DentalAgentType.SIKKA, SikkaErrorCode.SERVICE_UNAVAILABLE, true, details, underlying);
        this.name = 'SikkaNetworkError';
    }
}
export class SikkaError extends Error {
    constructor(message, agentType, cause) {
        super(message);
        this.agentType = agentType;
        this.cause = cause;
        this.name = 'SikkaError';
    }
}
export function handleSikkaError(error) {
    if (error instanceof AxiosError) {
        const response = error.response?.data;
        const status = error.response?.status || 500;
        const requestId = error.response?.headers['x-request-id'];
        const details = {
            requestId,
            statusCode: status,
            path: error.config?.url,
            timestamp: new Date().toISOString()
        };
        // Handle rate limiting
        if (status === 429) {
            const retryAfter = parseInt(error.response?.headers['retry-after'] || '60');
            details.retryAfter = retryAfter;
            throw new SikkaRateLimitError('Rate limit exceeded', DentalAgentType.SIKKA, details, error);
        }
        // Handle authentication errors
        if (status === 401) {
            throw new SikkaAuthenticationError(response?.error?.message || 'Authentication failed', DentalAgentType.SIKKA, details, error);
        }
        // Handle authorization errors
        if (status === 403) {
            throw new SikkaAuthorizationError(response?.error?.message || 'Authorization failed', details, error);
        }
        // Handle validation errors
        if (status === 400) {
            throw new SikkaValidationError(response?.error?.message || 'Validation failed', details, error);
        }
        // Handle not found errors
        if (status === 404) {
            throw new SikkaNotFoundError(response?.error?.message || 'Resource not found', details, error);
        }
        // Handle server errors
        if (status >= 500) {
            throw new SikkaServerError(response?.error?.message || 'Server error occurred', details, error);
        }
        // Handle all other errors
        throw new SikkaApiError(response?.error?.message || 'An unexpected error occurred', DentalAgentType.SIKKA, SikkaErrorCode.INVALID_REQUEST, false, details, error);
    }
    // Handle network errors
    if (error instanceof Error && error.message.includes('Network Error')) {
        throw new SikkaNetworkError('Network connection failed', {}, error);
    }
    // Handle unknown errors
    throw new SikkaApiError(error instanceof Error ? error.message : 'An unknown error occurred', DentalAgentType.SIKKA, SikkaErrorCode.SERVER_ERROR, false, { details: error }, error instanceof Error ? error : undefined);
}
