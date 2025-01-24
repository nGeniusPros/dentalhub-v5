import { NotificationConfig } from './types';
export declare const notificationConfig: NotificationConfig;
export declare const EMAIL_PROVIDER: NotificationConfig, SMS_PROVIDER: NotificationConfig, EMAIL_API_KEY: NotificationConfig, SMS_API_KEY: NotificationConfig, EMAIL_DOMAIN: NotificationConfig, SMS_FROM_NUMBER: NotificationConfig;
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
