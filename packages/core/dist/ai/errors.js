export class AiServiceError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'AiServiceError';
    }
}
export class RateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RateLimitError';
    }
}
