import { SikkaConfig } from './types';
export declare const SIKKA_API_URL: string | undefined;
export declare const SIKKA_API_KEY: string | undefined;
export declare const SIKKA_PRACTICE_ID: string | undefined;
export declare const SIKKA_MASTER_CUSTOMER_ID: string | undefined;
export declare const SIKKA_PRACTICE_KEY: string | undefined;
export declare const CACHE_TTL: {
    readonly NONE: 0;
    readonly SHORT: number;
    readonly MEDIUM: number;
    readonly LONG: number;
    readonly WEEK: number;
};
export declare const TIMEOUT_OPTIONS: {
    readonly timeout: 30000;
    readonly longTimeout: 60000;
};
export declare const RETRY_OPTIONS: {
    readonly retries: 3;
    readonly retryDelay: 1000;
    readonly maxRetryDelay: 10000;
    readonly retryCondition: (error: any) => boolean;
};
export declare const PAGINATION_DEFAULTS: {
    readonly defaultLimit: 50;
    readonly maxLimit: 200;
    readonly defaultPage: 1;
};
export declare const SORT_ORDER: {
    readonly ASC: "asc";
    readonly DESC: "desc";
};
export declare const sikkaConfig: SikkaConfig;
