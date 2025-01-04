import { RetellConfig } from './types';

function validateConfig(config: Partial<RetellConfig>): asserts config is RetellConfig {
  const required: (keyof RetellConfig)[] = ['apiKey', 'baseUrl', 'webhookSecret'];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Retell configuration: ${missing.join(', ')}. ` +
      'Please ensure all required environment variables are set.'
    );
  }
}

function loadConfig(): RetellConfig {
  const config: Partial<RetellConfig> = {
    apiKey: process.env.RETELL_API_KEY,
    baseUrl: process.env.RETELL_API_URL || 'https://api.retell.ai/v1',
    webhookSecret: process.env.RETELL_WEBHOOK_SECRET,
  };

  validateConfig(config);
  return config;
}

// Configuration with defaults and validation
export const retellConfig: RetellConfig = {
  ...loadConfig(),
};

// Export individual config values for convenience
export const {
  apiKey: RETELL_API_KEY,
  baseUrl: RETELL_API_URL,
  webhookSecret: RETELL_WEBHOOK_SECRET,
} = retellConfig;

// Call configuration
export const CALL_CONFIG = {
  maxDuration: 10 * 60, // 10 minutes in seconds
  maxRetries: 2,
  minDelayBetweenCalls: 60, // 1 minute in seconds
  defaultLanguage: 'en-US',
  recordingEnabled: true,
  transcriptionEnabled: true,
  aiAnalysisEnabled: true,
};

// Queue configuration
export const QUEUE_CONFIG = {
  maxConcurrentCalls: 5,
  priorityLevels: {
    high: 1,
    normal: 2,
    low: 3,
  },
  retryDelays: [5000, 15000, 30000], // Delays in milliseconds
		maxRetries: 3,
};

// Webhook configuration
export const WEBHOOK_CONFIG = {
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  timeout: 10000, // 10 seconds
  signatureHeader: 'X-Retell-Signature',
};

// Analysis configuration
export const ANALYSIS_CONFIG = {
  sentiment: {
    enabled: true,
    threshold: 0.7,
  },
  intents: {
    enabled: true,
    minConfidence: 0.8,
  },
  entities: {
    enabled: true,
    minConfidence: 0.7,
  },
  summary: {
    enabled: true,
    maxLength: 500,
  },
};

// Cache configuration
export const CACHE_CONFIG = {
  transcripts: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSize: 1000,
  },
  analysis: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSize: 1000,
  },
};

// Rate limiting configuration
export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50,     // max 50 requests per minute
};