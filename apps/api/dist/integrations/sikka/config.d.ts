import { SikkaConfig } from './types';
export declare const sikkaConfig: SikkaConfig;
export declare const SIKKA_API_URL: string, SIKKA_API_KEY: string, SIKKA_PRACTICE_ID: string;
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
export declare const CACHE_OPTIONS: {
    eligibility: {
        ttl: number;
        maxSize: number;
    };
    benefits: {
        ttl: number;
        maxSize: number;
    };
};
