export interface NotificationConfig {
  emailProvider: 'sendgrid' | 'mailgun' | 'smtp';
  smsProvider: 'twilio' | 'nexmo' | 'plivo';
  emailApiKey?: string;
  smsApiKey?: string;
  emailDomain?: string;
  smsFromNumber?: string;
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

export interface SmsOptions {
  to: string | string[];
  from?: string;
  text: string;
}

export interface NotificationData {
  type: 'email' | 'sms';
  options: EmailOptions | SmsOptions;
  metadata?: {
    patientId?: string;
    providerId?: string;
    createdAt?: string;
    notificationId?: string;
  };
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  providerResponse?: any;
  error?: NotificationError;
}

export interface NotificationError {
  code: string;
  message: string;
  details?: any;
}

export interface NotificationStorageOptions {
  bucket: string;
  path: string;
  acl?: 'private' | 'public-read';
  metadata?: Record<string, string>;
  expiresIn?: number;
}

export interface NotificationOptions {
  priority?: 'high' | 'normal' | 'low';
  webhook?: {
    url: string;
    secret: string;
  };
  storage?: NotificationStorageOptions;
  config?: NotificationConfig;
}