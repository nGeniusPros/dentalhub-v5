export class SyncException extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'SyncException';
        this.code = code;
        this.details = details;
    }
}
export function handleSyncError(error, defaultCode = 'UNKNOWN_ERROR') {
    if (error instanceof SyncException) {
        return {
            code: error.code,
            message: error.message,
            details: error.details,
        };
    }
    if (error instanceof Error) {
        return {
            code: defaultCode,
            message: error.message,
            details: {
                name: error.name,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
        };
    }
    return {
        code: defaultCode,
        message: 'An unexpected error occurred during synchronization',
        details: error,
    };
}
// Error code mappings
export const ErrorCodes = {
    // Calendar sync errors
    CALENDAR_SYNC_FAILED: 'calendar_sync_failed',
    CALENDAR_AUTH_ERROR: 'calendar_auth_error',
    CALENDAR_NOT_FOUND: 'calendar_not_found',
    INVALID_CALENDAR_EVENT: 'invalid_calendar_event',
    // Contacts sync errors
    CONTACTS_SYNC_FAILED: 'contacts_sync_failed',
    CONTACTS_AUTH_ERROR: 'contacts_auth_error',
    CONTACTS_LIST_NOT_FOUND: 'contacts_list_not_found',
    INVALID_CONTACT_DATA: 'invalid_contact_data',
    // Provider errors
    PROVIDER_ERROR: 'provider_error',
    PROVIDER_RATE_LIMIT: 'provider_rate_limit',
    PROVIDER_UNAVAILABLE: 'provider_unavailable',
    // Sync errors
    SYNC_CONFLICT: 'sync_conflict',
    SYNC_INTERRUPTED: 'sync_interrupted',
    SYNC_TIMEOUT: 'sync_timeout',
    // Configuration errors
    INVALID_CONFIG: 'invalid_config',
    MISSING_CREDENTIALS: 'missing_credentials',
    // System errors
    INTERNAL_ERROR: 'internal_error',
    SERVICE_UNAVAILABLE: 'service_unavailable',
    TIMEOUT: 'timeout',
};
export function isRetryableError(error) {
    const retryableCodes = new Set([
        'calendar_sync_failed',
        'contacts_sync_failed',
        'provider_rate_limit',
        'provider_unavailable',
        'sync_interrupted',
        'sync_timeout',
        'service_unavailable',
        'timeout',
    ]);
    return retryableCodes.has(error.code);
}
export function createError(code, message, details) {
    return new SyncException(message, ErrorCodes[code], details);
}
export function isSyncConflict(error) {
    return error.code === ErrorCodes.SYNC_CONFLICT;
}
export function isAuthError(error) {
    return error.code === ErrorCodes.CALENDAR_AUTH_ERROR ||
        error.code === ErrorCodes.CONTACTS_AUTH_ERROR;
}
export function isProviderError(error) {
    return error.code === ErrorCodes.PROVIDER_ERROR ||
        error.code === ErrorCodes.PROVIDER_RATE_LIMIT ||
        error.code === ErrorCodes.PROVIDER_UNAVAILABLE;
}
