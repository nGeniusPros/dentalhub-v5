import { SikkaConfig } from './types';
export declare const SIKKA_API_URL: string | undefined;
export declare const SIKKA_API_KEY: string | undefined;
export declare const SIKKA_PRACTICE_ID: string | undefined;
export declare const SIKKA_MASTER_CUSTOMER_ID: string | undefined;
export declare const SIKKA_PRACTICE_KEY: string | undefined;
export declare const RETRY_OPTIONS: {
    retries: number;
    retryDelay: number;
    retryCondition: (error: any) => boolean;
};
export declare const TIMEOUT_OPTIONS: {
    timeout: number;
};
export declare const sikkaConfig: SikkaConfig;
