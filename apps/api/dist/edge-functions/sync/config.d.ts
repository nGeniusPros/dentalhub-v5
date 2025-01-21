import { SyncConfig } from './types';
export declare const syncConfig: SyncConfig;
export declare const CALENDAR_PROVIDER: "google" | "microsoft" | "ical", CONTACTS_PROVIDER: "google" | "microsoft" | "vcard", CALENDAR_API_KEY: string | undefined, CONTACTS_API_KEY: string | undefined, CALENDAR_ID: string | undefined, CONTACTS_LIST_ID: string | undefined;
export declare const RETRY_OPTIONS: {
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs: number;
};
export declare const TIMEOUT_OPTIONS: {
    request: number;
    connect: number;
};
export declare const RATE_LIMIT: {
    windowMs: number;
    maxRequests: number;
};
export declare const SYNC_CONFIG: {
    calendar: {
        defaultSyncInterval: number;
        maxSyncInterval: number;
        minSyncInterval: number;
        defaultTimeZone: string;
        maxEventsPerSync: number;
        maxHistoryDays: number;
    };
    contacts: {
        defaultSyncInterval: number;
        maxSyncInterval: number;
        minSyncInterval: number;
        maxContactsPerSync: number;
        maxHistoryDays: number;
    };
};
export declare const CACHE_CONFIG: {
    calendar: {
        ttl: number;
        maxSize: number;
    };
    contacts: {
        ttl: number;
        maxSize: number;
    };
};
