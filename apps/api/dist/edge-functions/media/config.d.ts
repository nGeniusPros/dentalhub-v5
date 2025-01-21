import { MediaConfig } from './types';
export declare const mediaConfig: MediaConfig;
export declare const IMAGE_PROVIDER: "cloudinary" | "imgix" | "s3", IMAGE_API_KEY: string | undefined, IMAGE_API_SECRET: string | undefined, IMAGE_CLOUD_NAME: string | undefined, IMAGE_BUCKET_NAME: string | undefined, IMAGE_REGION: string | undefined;
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
