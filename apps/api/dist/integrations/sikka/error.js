import { AxiosError } from 'axios';
export class SikkaIntegrationError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'SikkaIntegrationError';
        this.code = code;
        this.details = details;
    }
}
export function handleSikkaError(error) {
    if (error instanceof AxiosError) {
        const sikkaError = error.response?.data?.error || {
            code: 'UNKNOWN_ERROR',
            message: 'An unknown error occurred with the Sikka API',
        };
        throw new SikkaIntegrationError(sikkaError.message, sikkaError.code, sikkaError.details);
    }
    if (error instanceof Error) {
        throw new SikkaIntegrationError(error.message, 'INTERNAL_ERROR', { originalError: error });
    }
    throw new SikkaIntegrationError('An unexpected error occurred', 'UNEXPECTED_ERROR', { originalError: error });
}
export function isRetryableError(error) {
    if (error instanceof SikkaIntegrationError) {
        const retryableCodes = [
            'NETWORK_ERROR',
            'TIMEOUT_ERROR',
            'RATE_LIMIT_ERROR',
            'SERVICE_UNAVAILABLE'
        ];
        return retryableCodes.includes(error.code);
    }
    return false;
}
