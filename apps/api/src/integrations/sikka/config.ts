import { SikkaConfig } from './types';

function validateConfig(config: Partial<SikkaConfig>): asserts config is SikkaConfig {
  const required: (keyof SikkaConfig)[] = ['baseUrl', 'apiKey', 'practiceId'];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Sikka configuration: ${missing.join(', ')}. ` +
      'Please ensure all required environment variables are set.'
    );
  }
}

function loadConfig(): SikkaConfig {
  const config: Partial<SikkaConfig> = {
    baseUrl: process.env.SIKKA_API_URL,
    apiKey: process.env.SIKKA_API_KEY,
    practiceId: process.env.SIKKA_PRACTICE_ID,
  };

  validateConfig(config);
  return config;
}

// Configuration with defaults and validation
export const sikkaConfig: SikkaConfig = {
  ...loadConfig(),
  // Add any additional configuration options here
};

// Export individual config values for convenience
export const {
  baseUrl: SIKKA_API_URL,
  apiKey: SIKKA_API_KEY,
  practiceId: SIKKA_PRACTICE_ID,
} = sikkaConfig;

// Retry configuration
export const RETRY_OPTIONS = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 5000,
};

// Timeout configuration
export const TIMEOUT_OPTIONS = {
  request: 30000, // 30 seconds
  connect: 5000,  // 5 seconds
};

// Rate limiting configuration
export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,    // max 100 requests per minute
};

// Cache configuration
export const CACHE_OPTIONS = {
  eligibility: {
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 1000,            // max 1000 items
  },
  benefits: {
    ttl: 12 * 60 * 60 * 1000, // 12 hours
    maxSize: 1000,            // max 1000 items
  },
};