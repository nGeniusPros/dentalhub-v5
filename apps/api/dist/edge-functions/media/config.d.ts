import { MediaConfig } from './types';
export declare const mediaConfig: MediaConfig;
export declare const IMAGE_PROVIDER: MediaConfig, IMAGE_API_KEY: MediaConfig, IMAGE_API_SECRET: MediaConfig, IMAGE_CLOUD_NAME: MediaConfig, IMAGE_BUCKET_NAME: MediaConfig, IMAGE_REGION: MediaConfig;
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
