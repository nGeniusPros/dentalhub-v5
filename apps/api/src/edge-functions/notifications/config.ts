import { NotificationConfig } from "./types";

function validateConfig(
  config: Partial<NotificationConfig>,
): asserts config is NotificationConfig {
  const required: (keyof NotificationConfig)[] = [
    "emailProvider",
    "smsProvider",
  ];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required notification configuration: ${missing.join(", ")}. ` +
        "Please ensure all required environment variables are set.",
    );
  }
}

function loadConfig(): NotificationConfig {
  const config: Partial<NotificationConfig> = {
    emailProvider: process.env.EMAIL_PROVIDER as any,
    smsProvider: process.env.SMS_PROVIDER as any,
    emailApiKey: process.env.EMAIL_API_KEY,
    smsApiKey: process.env.SMS_API_KEY,
    emailDomain: process.env.EMAIL_DOMAIN,
    smsFromNumber: process.env.SMS_FROM_NUMBER,
  };

  validateConfig(config);
  return config;
}

// Configuration with defaults and validation
export const notificationConfig: NotificationConfig = {
  ...loadConfig(),
};

// Export individual config values for convenience
export const {
  emailProvider: EMAIL_PROVIDER,
  smsProvider: SMS_PROVIDER,
  emailApiKey: EMAIL_API_KEY,
  smsApiKey: SMS_API_KEY,
  emailDomain: EMAIL_DOMAIN,
  smsFromNumber: SMS_FROM_NUMBER,
} = notificationConfig;

// Retry configuration
export const RETRY_OPTIONS = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 5000,
};

// Timeout configuration
export const TIMEOUT_OPTIONS = {
  request: 30000, // 30 seconds
  connect: 5000, // 5 seconds
};

// Rate limiting configuration
export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // max 100 requests per minute
};
