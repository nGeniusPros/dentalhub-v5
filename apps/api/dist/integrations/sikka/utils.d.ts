import { RequestOptions } from './types';
/**
 * Prepare request parameters with sorting and pagination
 * @param params Base parameters for the request
 * @param options Additional request options including sorting and pagination
 * @returns Combined parameters for the API request
 */
export declare function prepareRequestParams(params?: Record<string, any>, options?: RequestOptions): Record<string, any>;
/**
 * Get cache TTL based on options or default
 * @param options Request options containing cache settings
 * @returns Cache TTL in seconds
 */
export declare function getCacheTTL(options?: RequestOptions): number;
/**
 * Get request timeout based on options or default
 * @param options Request options containing timeout setting
 * @returns Timeout in milliseconds
 */
export declare function getRequestTimeout(options?: RequestOptions): number;
/**
 * Generate cache key for API requests
 * @param endpoint API endpoint
 * @param params Request parameters
 * @returns Cache key string
 */
export declare function generateCacheKey(endpoint: string, params?: Record<string, any>): string;
/**
 * Validate date format (yyyy-mm-dd)
 * @param date Date string to validate
 * @returns true if valid, false otherwise
 */
export declare function isValidDateFormat(date: string): boolean;
/**
 * Validate request parameters
 * @param params Parameters to validate
 * @param requiredFields Array of required field names
 * @throws Error if validation fails
 */
export declare function validateRequestParams(params: Record<string, any>, requiredFields?: string[]): void;
