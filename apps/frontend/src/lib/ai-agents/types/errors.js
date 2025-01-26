// Base error class for all AI agent errors
export class AgentError extends Error {
    constructor(message, agentType, code, retryable, underlying) {
        super(message);
        this.agentType = agentType;
        this.code = code;
        this.retryable = retryable;
        this.underlying = underlying;
        this.name = 'AgentError';
    }
}
// OpenAI specific error types
export class OpenAIError extends AgentError {
    constructor(message, agentType, code, retryable, status, underlying) {
        super(message, agentType, code, retryable, underlying);
        this.status = status;
        this.name = 'OpenAIError';
    }
}
// OpenAI error codes based on their API documentation
export var OpenAIErrorCode;
(function (OpenAIErrorCode) {
    // Authentication/Authorization
    OpenAIErrorCode["INVALID_AUTH"] = "invalid_authentication";
    OpenAIErrorCode["INVALID_API_KEY"] = "invalid_api_key";
    OpenAIErrorCode["NO_PERMISSION"] = "permission_denied";
    OpenAIErrorCode["ORG_NOT_FOUND"] = "organization_not_found";
    // Rate Limits
    OpenAIErrorCode["RATE_LIMIT"] = "rate_limit_exceeded";
    OpenAIErrorCode["QUOTA_EXCEEDED"] = "quota_exceeded";
    OpenAIErrorCode["ENGINE_OVERLOADED"] = "server_overloaded";
    // Invalid Requests
    OpenAIErrorCode["INVALID_REQUEST"] = "invalid_request";
    OpenAIErrorCode["MODEL_NOT_FOUND"] = "model_not_found";
    OpenAIErrorCode["VALIDATION_ERROR"] = "validation_error";
    OpenAIErrorCode["CONTENT_POLICY"] = "content_policy_violation";
    OpenAIErrorCode["MAX_TOKENS"] = "max_tokens_exceeded";
    OpenAIErrorCode["CONTEXT_LENGTH"] = "context_length_exceeded";
    // Server Errors
    OpenAIErrorCode["API_ERROR"] = "api_error";
    OpenAIErrorCode["TIMEOUT"] = "timeout";
    OpenAIErrorCode["SERVICE_UNAVAILABLE"] = "service_unavailable";
})(OpenAIErrorCode || (OpenAIErrorCode = {}));
// Sikka API specific error codes
export var SikkaErrorCode;
(function (SikkaErrorCode) {
    // Authentication
    SikkaErrorCode["INVALID_TOKEN"] = "invalid_token";
    SikkaErrorCode["TOKEN_EXPIRED"] = "token_expired";
    SikkaErrorCode["INVALID_CREDENTIALS"] = "invalid_credentials";
    // Authorization
    SikkaErrorCode["UNAUTHORIZED"] = "unauthorized";
    SikkaErrorCode["INSUFFICIENT_SCOPE"] = "insufficient_scope";
    // Resource Errors
    SikkaErrorCode["RESOURCE_NOT_FOUND"] = "resource_not_found";
    SikkaErrorCode["PRACTICE_NOT_FOUND"] = "practice_not_found";
    SikkaErrorCode["INVALID_PRACTICE_ID"] = "invalid_practice_id";
    // Rate Limiting
    SikkaErrorCode["API_RATE_LIMIT"] = "api_rate_limit";
    SikkaErrorCode["CONCURRENT_REQUEST_LIMIT"] = "concurrent_request_limit";
    // Request Errors
    SikkaErrorCode["INVALID_REQUEST"] = "invalid_request";
    SikkaErrorCode["INVALID_PARAMETERS"] = "invalid_parameters";
    SikkaErrorCode["VALIDATION_ERROR"] = "validation_error";
    // Server Errors
    SikkaErrorCode["SERVER_ERROR"] = "server_error";
    SikkaErrorCode["SERVICE_UNAVAILABLE"] = "service_unavailable";
    SikkaErrorCode["GATEWAY_TIMEOUT"] = "gateway_timeout";
})(SikkaErrorCode || (SikkaErrorCode = {}));
// Sikka API error class
export class SikkaApiError extends AgentError {
    constructor(message, agentType, code, retryable, details, underlying) {
        super(message, agentType, code, retryable, underlying);
        this.details = details;
        this.name = 'SikkaApiError';
    }
}
// Specific Sikka error types
export class SikkaAuthenticationError extends SikkaApiError {
    constructor(message, agentType, details, underlying) {
        super(message, agentType, SikkaErrorCode.INVALID_TOKEN, false, details, underlying);
        this.name = 'SikkaAuthenticationError';
    }
}
export class SikkaRateLimitError extends SikkaApiError {
    constructor(message, agentType, details, underlying) {
        super(message, agentType, SikkaErrorCode.API_RATE_LIMIT, true, details, underlying);
        this.name = 'SikkaRateLimitError';
    }
}
// Helper function to determine if a Sikka error is retryable
export function isSikkaErrorRetryable(code) {
    return [
        SikkaErrorCode.API_RATE_LIMIT,
        SikkaErrorCode.CONCURRENT_REQUEST_LIMIT,
        SikkaErrorCode.SERVICE_UNAVAILABLE,
        SikkaErrorCode.GATEWAY_TIMEOUT,
        SikkaErrorCode.SERVER_ERROR
    ].includes(code);
}
// Network related errors
export class NetworkError extends AgentError {
    constructor(agentType, message = 'Network request failed', underlying) {
        super(message, agentType, 'NETWORK_ERROR', true, underlying);
        this.name = 'NetworkError';
    }
}
// Rate limiting errors
export class RateLimitError extends AgentError {
    constructor(agentType, retryAfter, message = 'Rate limit exceeded') {
        super(message, agentType, 'RATE_LIMIT', true);
        this.retryAfter = retryAfter;
        this.name = 'RateLimitError';
    }
}
// Validation errors
export class ValidationError extends AgentError {
    constructor(message, agentType, field) {
        super(message, agentType, 'VALIDATION_ERROR', false);
        this.field = field;
        this.name = 'ValidationError';
    }
}
// Helper function to determine if an error is retryable
export function isRetryableError(error) {
    if (error instanceof AgentError) {
        return error.retryable;
    }
    // Network errors are generally retryable
    return error instanceof TypeError || error.name === 'NetworkError';
}
// Helper function to convert OpenAI API errors
export function convertOpenAIError(error, agentType) {
    if (!error.response) {
        return new NetworkError(agentType, error.message, error);
    }
    const { status, data } = error.response;
    const code = data?.error?.code || data?.error?.type;
    const message = data?.error?.message || 'Unknown OpenAI error';
    // Determine if the error is retryable
    const retryable = status === 429 || status >= 500;
    switch (code) {
        case 'rate_limit_exceeded':
            return new RateLimitError(agentType, parseInt(error.response.headers['retry-after']), message);
        case 'invalid_api_key':
        case 'permission_denied':
            return new OpenAIError(message, agentType, code, false, status, error);
        case 'context_length_exceeded':
        case 'max_tokens_exceeded':
            return new ValidationError(message, agentType, 'tokens');
        default:
            return new OpenAIError(message, agentType, code || OpenAIErrorCode.API_ERROR, retryable, status, error);
    }
}
export function createErrorResponse(error) {
    if (error instanceof AgentError) {
        return {
            error: {
                code: error.code,
                message: error.message,
                retryable: error.retryable,
                details: error instanceof OpenAIError ? { status: error.status } : undefined
            }
        };
    }
    return {
        error: {
            code: 'UNKNOWN_ERROR',
            message: error.message || 'An unknown error occurred',
            retryable: isRetryableError(error)
        }
    };
}
//# sourceMappingURL=errors.js.map