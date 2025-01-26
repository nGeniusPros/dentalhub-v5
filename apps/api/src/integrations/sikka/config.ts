import { SikkaConfig } from "./types";

export const SIKKA_API_URL = process.env.SIKKA_API_URL;
export const SIKKA_API_KEY = process.env.SIKKA_API_KEY;
export const SIKKA_PRACTICE_ID = process.env.SIKKA_PRACTICE_ID;
export const SIKKA_MASTER_CUSTOMER_ID = process.env.SIKKA_MASTER_CUSTOMER_ID;
export const SIKKA_PRACTICE_KEY = process.env.SIKKA_PRACTICE_KEY;

if (!process.env.SIKKA_APP_ID) {
  throw new Error("SIKKA_APP_ID environment variable is required");
}

if (!process.env.SIKKA_APP_KEY) {
  throw new Error("SIKKA_APP_KEY environment variable is required");
}

if (!process.env.SIKKA_PRACTICE_ID) {
  throw new Error("SIKKA_PRACTICE_ID environment variable is required");
}

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  NONE: 0,
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 24 * 60 * 60, // 24 hours
  WEEK: 7 * 24 * 60 * 60, // 1 week
} as const;

// Default timeout options
export const TIMEOUT_OPTIONS = {
  timeout: 30000, // 30 seconds
  longTimeout: 60000, // 1 minute for long-running operations
} as const;

// Retry configurations
export const RETRY_OPTIONS = {
  retries: 3,
  retryDelay: 1000, // Base delay in ms
  maxRetryDelay: 10000, // Maximum delay between retries
  retryCondition: (error: any) => {
    return error.response?.status === 429 || error.response?.status >= 500;
  },
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  defaultLimit: 50,
  maxLimit: 200,
  defaultPage: 1,
} as const;

// Sort order options
export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const sikkaConfig: SikkaConfig = {
  baseUrl: process.env.SIKKA_API_URL || "https://api.sikkasoft.com/v4",
  appId: process.env.SIKKA_APP_ID,
  appKey: process.env.SIKKA_APP_KEY,
  practiceId: process.env.SIKKA_PRACTICE_ID,
  masterCustomerId: process.env.SIKKA_MASTER_CUSTOMER_ID || "",
  practiceKey: process.env.SIKKA_PRACTICE_KEY || "",
  tokenRefreshThreshold: 5, // 5 minutes before expiration
  maxRetryAttempts: 3,
  rateLimitDelay: 1000, // 1 second
} as const;
