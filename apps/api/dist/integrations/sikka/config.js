export const SIKKA_API_URL = process.env.SIKKA_API_URL;
export const SIKKA_API_KEY = process.env.SIKKA_API_KEY;
export const SIKKA_PRACTICE_ID = process.env.SIKKA_PRACTICE_ID;
export const SIKKA_MASTER_CUSTOMER_ID = process.env.SIKKA_MASTER_CUSTOMER_ID;
export const SIKKA_PRACTICE_KEY = process.env.SIKKA_PRACTICE_KEY;
if (!process.env.SIKKA_APP_ID) {
    throw new Error('SIKKA_APP_ID environment variable is required');
}
if (!process.env.SIKKA_APP_KEY) {
    throw new Error('SIKKA_APP_KEY environment variable is required');
}
if (!process.env.SIKKA_PRACTICE_ID) {
    throw new Error('SIKKA_PRACTICE_ID environment variable is required');
}
export const RETRY_OPTIONS = {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
        return error.response?.status === 429 || error.response?.status >= 500;
    }
};
export const TIMEOUT_OPTIONS = {
    timeout: 30000 // 30 seconds
};
export const sikkaConfig = {
    baseUrl: process.env.SIKKA_API_URL || 'https://api.sikkasoft.com/v4',
    appId: process.env.SIKKA_APP_ID,
    appKey: process.env.SIKKA_APP_KEY,
    practiceId: process.env.SIKKA_PRACTICE_ID,
    masterCustomerId: process.env.SIKKA_MASTER_CUSTOMER_ID || '',
    practiceKey: process.env.SIKKA_PRACTICE_KEY || '',
    tokenRefreshThreshold: 5, // 5 minutes before expiration
    maxRetryAttempts: 3,
    rateLimitDelay: 1000 // 1 second
};
