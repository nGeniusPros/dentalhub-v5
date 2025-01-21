import { SyncError } from './types';
export declare class SyncException extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleSyncError(error: unknown, defaultCode?: string): SyncError;
export declare const ErrorCodes: {
    readonly CALENDAR_SYNC_FAILED: "calendar_sync_failed";
    readonly CALENDAR_AUTH_ERROR: "calendar_auth_error";
    readonly CALENDAR_NOT_FOUND: "calendar_not_found";
    readonly INVALID_CALENDAR_EVENT: "invalid_calendar_event";
    readonly CONTACTS_SYNC_FAILED: "contacts_sync_failed";
    readonly CONTACTS_AUTH_ERROR: "contacts_auth_error";
    readonly CONTACTS_LIST_NOT_FOUND: "contacts_list_not_found";
    readonly INVALID_CONTACT_DATA: "invalid_contact_data";
    readonly PROVIDER_ERROR: "provider_error";
    readonly PROVIDER_RATE_LIMIT: "provider_rate_limit";
    readonly PROVIDER_UNAVAILABLE: "provider_unavailable";
    readonly SYNC_CONFLICT: "sync_conflict";
    readonly SYNC_INTERRUPTED: "sync_interrupted";
    readonly SYNC_TIMEOUT: "sync_timeout";
    readonly INVALID_CONFIG: "invalid_config";
    readonly MISSING_CREDENTIALS: "missing_credentials";
    readonly INTERNAL_ERROR: "internal_error";
    readonly SERVICE_UNAVAILABLE: "service_unavailable";
    readonly TIMEOUT: "timeout";
};
export declare function isRetryableError(error: SyncError): boolean;
export declare function createError(code: keyof typeof ErrorCodes, message: string, details?: any): SyncException;
export declare function isSyncConflict(error: SyncError): boolean;
export declare function isAuthError(error: SyncError): boolean;
export declare function isProviderError(error: SyncError): boolean;
