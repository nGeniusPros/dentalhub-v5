import { NotificationError } from './types';
export declare class NotificationException extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare function handleNotificationError(error: unknown, defaultCode?: string): NotificationError;
export declare const ErrorCodes: {
    readonly EMAIL_SEND_FAILED: "email_send_failed";
    readonly EMAIL_CONFIG_ERROR: "email_config_error";
    readonly INVALID_EMAIL_ADDRESS: "invalid_email_address";
    readonly SMS_SEND_FAILED: "sms_send_failed";
    readonly SMS_CONFIG_ERROR: "sms_config_error";
    readonly INVALID_PHONE_NUMBER: "invalid_phone_number";
    readonly UNSUPPORTED_NOTIFICATION_TYPE: "unsupported_notification_type";
    readonly NOTIFICATION_SEND_FAILED: "notification_send_failed";
    readonly INTERNAL_ERROR: "internal_error";
    readonly SERVICE_UNAVAILABLE: "service_unavailable";
    readonly TIMEOUT: "timeout";
};
export declare function isRetryableError(error: NotificationError): boolean;
export declare function createError(code: keyof typeof ErrorCodes, message: string, details?: any): NotificationException;
