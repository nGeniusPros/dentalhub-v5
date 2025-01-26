export class InfrastructureError extends Error {
    constructor(code, cause, metadata) {
        const message = `Infrastructure error: ${code}${cause ? ` - ${cause.message}` : ""}`;
        super(message);
        this.name = "InfrastructureError";
        this.code = code;
        this.cause = cause;
        this.metadata = metadata;
    }
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}
export class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthorizationError";
    }
}
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
export class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
    }
}
//# sourceMappingURL=index.js.map