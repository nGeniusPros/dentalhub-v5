import { MediaConfig } from "./types";

function validateConfig(
  config: Partial<MediaConfig>,
): asserts config is MediaConfig {
  const required: (keyof MediaConfig)[] = ["imageProvider"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required media configuration: ${missing.join(", ")}. ` +
        "Please ensure all required environment variables are set.",
    );
  }
}

function loadConfig(): MediaConfig {
  const config: Partial<MediaConfig> = {
    imageProvider: process.env.IMAGE_PROVIDER as any,
    apiKey: process.env.IMAGE_API_KEY,
    apiSecret: process.env.IMAGE_API_SECRET,
    cloudName: process.env.IMAGE_CLOUD_NAME,
    bucketName: process.env.IMAGE_BUCKET_NAME,
    region: process.env.IMAGE_REGION,
  };

  validateConfig(config);
  return config;
}

// Configuration with defaults and validation
export const mediaConfig: MediaConfig = {
  ...loadConfig(),
};

// Export individual config values for convenience
export const {
  imageProvider: IMAGE_PROVIDER,
  apiKey: IMAGE_API_KEY,
  apiSecret: IMAGE_API_SECRET,
  cloudName: IMAGE_CLOUD_NAME,
  bucketName: IMAGE_BUCKET_NAME,
  region: IMAGE_REGION,
} = mediaConfig;

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
