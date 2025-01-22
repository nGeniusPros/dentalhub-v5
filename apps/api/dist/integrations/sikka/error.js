import axios from 'axios';
export class SikkaBaseError extends Error {
    constructor(message, errorType, details) {
        super(message);
        this.name = 'SikkaBaseError';
        this.errorType = errorType;
        this.details = details;
    }
}
export class SikkaAuthenticationError extends SikkaBaseError {
    constructor(message, details) {
        super(message, 'AUTHENTICATION_ERROR', details);
        this.name = 'SikkaAuthenticationError';
    }
}
export class SikkaRateLimitError extends SikkaBaseError {
    constructor(message, details) {
        super(message, 'RATE_LIMIT_ERROR', details);
        this.name = 'SikkaRateLimitError';
    }
}
export class SikkaTimeoutError extends SikkaBaseError {
    constructor(message, details) {
        super(message, 'TIMEOUT_ERROR', details);
        this.name = 'SikkaTimeoutError';
    }
}
export class SikkaApiError extends SikkaBaseError {
    constructor(message, details) {
        super(message, 'API_ERROR', details);
        this.name = 'SikkaApiError';
    }
}
export function handleSikkaError(error) {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        const status = axiosError.response?.status;
        const details = {
            status,
            response: axiosError.response?.data,
            originalError: error
        };
        // Handle specific HTTP status codes
        switch (status) {
            case 401:
            case 403:
                throw new SikkaAuthenticationError('Authentication failed with Sikka API', details);
            case 429:
                throw new SikkaRateLimitError('Rate limit exceeded for Sikka API', details);
            case 408:
            case 504:
                throw new SikkaTimeoutError('Request to Sikka API timed out', details);
            default:
                // Handle specific Sikka API error codes if present in response
                const sikkaError = axiosError.response?.data?.error;
                if (sikkaError) {
                    throw new SikkaApiError(sikkaError.long_message || sikkaError.short_message || 'Unknown Sikka API error', {
                        ...details,
                        sikkaErrorCode: sikkaError.error_code
                    });
                }
                throw new SikkaApiError(axiosError.message || 'Unknown error occurred while calling Sikka API', details);
        }
    }
    // Handle non-Axios errors
    throw new SikkaApiError(error instanceof Error ? error.message : 'Unknown error occurred', { originalError: error });
}
