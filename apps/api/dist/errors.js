export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["CONFIGURATION_ERROR"] = "CONFIGURATION_ERROR";
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "EXTERNAL_SERVICE_ERROR";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
})(ErrorCode || (ErrorCode = {}));
export class ErrorResponse extends Error {
    constructor({ message, code, statusCode = 500, originalError, }) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.originalError = originalError;
        this.name = 'ErrorResponse'; // or specific error name
    }
    serializeErrorResponse() {
        return {
            type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500', // Generic error type
            title: 'Application error',
            status: this.statusCode,
            detail: this.message,
            errorCode: this.code,
        };
    }
}
