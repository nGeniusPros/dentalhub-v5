import { SyncConfig } from "./types";

function validateConfig(
  config: Partial<SyncConfig>,
): asserts config is SyncConfig {
  const required: (keyof SyncConfig)[] = [
    "calendarProvider",
    "contactsProvider",
  ];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required sync configuration: ${missing.join(", ")}. ` +
        "Please ensure all required environment variables are set.",
    );
  }
}

function loadConfig(): SyncConfig {
  const config: Partial<SyncConfig> = {
    calendarProvider: process.env.CALENDAR_PROVIDER as any,
    contactsProvider: process.env.CONTACTS_PROVIDER as any,
    calendarApiKey: process.env.CALENDAR_API_KEY,
    contactsApiKey: process.env.CONTACTS_API_KEY,
    calendarId: process.env.CALENDAR_ID,
    contactsListId: process.env.CONTACTS_LIST_ID,
  };

  validateConfig(config);
  return config;
}

// Configuration with defaults and validation
export const syncConfig: SyncConfig = {
  ...loadConfig(),
};

// Export individual config values for convenience
export const {
  calendarProvider: CALENDAR_PROVIDER,
  contactsProvider: CONTACTS_PROVIDER,
  calendarApiKey: CALENDAR_API_KEY,
  contactsApiKey: CONTACTS_API_KEY,
  calendarId: CALENDAR_ID,
  contactsListId: CONTACTS_LIST_ID,
} = syncConfig;

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

// Sync configuration
export const SYNC_CONFIG = {
  calendar: {
    defaultSyncInterval: 15, // 15 minutes
    maxSyncInterval: 1440, // 24 hours
    minSyncInterval: 5, // 5 minutes
    defaultTimeZone: "UTC",
    maxEventsPerSync: 1000,
    maxHistoryDays: 90, // 3 months
  },
  contacts: {
    defaultSyncInterval: 60, // 1 hour
    maxSyncInterval: 1440, // 24 hours
    minSyncInterval: 15, // 15 minutes
    maxContactsPerSync: 1000,
    maxHistoryDays: 90, // 3 months
  },
};

// Cache configuration
export const CACHE_CONFIG = {
  calendar: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
  },
  contacts: {
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 1000,
  },
};
