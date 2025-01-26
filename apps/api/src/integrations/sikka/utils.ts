import { RequestOptions } from "./types";
import { CACHE_TTL, TIMEOUT_OPTIONS } from "./config";

/**
 * Prepare request parameters with sorting and pagination
 * @param params Base parameters for the request
 * @param options Additional request options including sorting and pagination
 * @returns Combined parameters for the API request
 */
export function prepareRequestParams(
  params: Record<string, any> = {},
  options: RequestOptions = {},
): Record<string, any> {
  const {
    sortBy,
    sortOrder,
    page,
    limit,
    offset,
    cache,
    cacheTTL,
    timeout,
    ...rest
  } = options;

  const requestParams = { ...params };

  // Add sorting
  if (sortBy) {
    requestParams.sort_by = sortBy;
    requestParams.sort_order = sortOrder || "asc";
  }

  // Add pagination
  if (page) {
    requestParams.page = page;
  }
  if (limit) {
    requestParams.limit = limit;
  }
  if (offset) {
    requestParams.offset = offset;
  }

  // Remove undefined values
  Object.keys(requestParams).forEach((key) => {
    if (requestParams[key] === undefined) {
      delete requestParams[key];
    }
  });

  return { ...requestParams, ...rest };
}

/**
 * Get cache TTL based on options or default
 * @param options Request options containing cache settings
 * @returns Cache TTL in seconds
 */
export function getCacheTTL(options?: RequestOptions): number {
  if (options?.cache === false) {
    return 0;
  }
  return options?.cacheTTL || CACHE_TTL.SHORT;
}

/**
 * Get request timeout based on options or default
 * @param options Request options containing timeout setting
 * @returns Timeout in milliseconds
 */
export function getRequestTimeout(options?: RequestOptions): number {
  return options?.timeout || TIMEOUT_OPTIONS.timeout;
}

/**
 * Generate cache key for API requests
 * @param endpoint API endpoint
 * @param params Request parameters
 * @returns Cache key string
 */
export function generateCacheKey(
  endpoint: string,
  params: Record<string, any> = {},
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = params[key];
        return acc;
      },
      {} as Record<string, any>,
    );

  return `${endpoint}-${JSON.stringify(sortedParams)}`;
}

/**
 * Validate date format (yyyy-mm-dd)
 * @param date Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
}

/**
 * Validate request parameters
 * @param params Parameters to validate
 * @param requiredFields Array of required field names
 * @throws Error if validation fails
 */
export function validateRequestParams(
  params: Record<string, any>,
  requiredFields: string[] = [],
): void {
  // Check required fields
  for (const field of requiredFields) {
    if (!params[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate dates if present
  const dateFields = ["startdate", "enddate", "first_visit", "last_visit"];
  for (const field of dateFields) {
    if (params[field] && !isValidDateFormat(params[field])) {
      throw new Error(`Invalid date format for ${field}. Expected yyyy-mm-dd`);
    }
  }
}
