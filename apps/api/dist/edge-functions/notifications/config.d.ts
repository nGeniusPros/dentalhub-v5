import { NotificationConfig } from './types';
export declare const notificationConfig: NotificationConfig;
export declare const EMAIL_PROVIDER: "sendgrid" | "mailgun" | "smtp", SMS_PROVIDER: "twilio" | "nexmo" | "plivo", EMAIL_API_KEY: string | undefined, SMS_API_KEY: string | undefined, EMAIL_DOMAIN: string | undefined, SMS_FROM_NUMBER: string | undefined;
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
