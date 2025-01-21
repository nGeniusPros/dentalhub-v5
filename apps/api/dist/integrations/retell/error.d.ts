import { RetellApiError } from './types';
export declare class RetellIntegrationError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleRetellError(error: unknown): never;
export declare function isRetryableError(error: unknown): boolean;
export declare function validateWebhookSignature(signature: string, body: string, secret: string): boolean;
export declare function handleWebhookError(error: unknown): RetellApiError;
export declare const ErrorCodes: {
    readonly INVALID_API_KEY: "invalid_api_key";
    readonly EXPIRED_API_KEY: "expired_api_key";
    readonly INVALID_PHONE_NUMBER: "invalid_phone_number";
    readonly CALL_FAILED: "call_failed";
    readonly CALL_TIMEOUT: "call_timeout";
    readonly TRANSCRIPTION_FAILED: "transcription_failed";
    readonly INVALID_AUDIO: "invalid_audio";
    readonly ANALYSIS_FAILED: "analysis_failed";
    readonly INVALID_TRANSCRIPT: "invalid_transcript";
    readonly RATE_LIMIT_EXCEEDED: "rate_limit_exceeded";
    readonly INVALID_SIGNATURE: "invalid_signature";
    readonly WEBHOOK_TIMEOUT: "webhook_timeout";
    readonly INTERNAL_ERROR: "internal_error";
    readonly SERVICE_UNAVAILABLE: "service_unavailable";
};
