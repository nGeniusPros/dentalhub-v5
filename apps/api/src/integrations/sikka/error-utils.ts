import { AxiosError } from "axios";
import { DentalAgentType } from "@dental/core/ai/types";
import {
  SikkaErrorCode,
  SikkaErrorDetails,
} from "../../../../frontend/src/lib/ai-agents/types/errors";

/**
 * Extracts error details from an Axios error response
 */
export function extractErrorDetails(error: AxiosError): SikkaErrorDetails {
  return {
    requestId: error.response?.headers["x-request-id"],
    statusCode: error.response?.status,
    path: error.config?.url,
    timestamp: new Date().toISOString(),
    details: error.response?.data,
  };
}

/**
 * Maps HTTP status codes to Sikka error codes
 */
export function mapHttpStatusToErrorCode(status: number): SikkaErrorCode {
  switch (status) {
    case 400:
      return SikkaErrorCode.INVALID_REQUEST;
    case 401:
      return SikkaErrorCode.INVALID_TOKEN;
    case 403:
      return SikkaErrorCode.UNAUTHORIZED;
    case 404:
      return SikkaErrorCode.RESOURCE_NOT_FOUND;
    case 429:
      return SikkaErrorCode.API_RATE_LIMIT;
    case 500:
      return SikkaErrorCode.SERVER_ERROR;
    case 503:
      return SikkaErrorCode.SERVICE_UNAVAILABLE;
    case 504:
      return SikkaErrorCode.GATEWAY_TIMEOUT;
    default:
      return status >= 500
        ? SikkaErrorCode.SERVER_ERROR
        : SikkaErrorCode.INVALID_REQUEST;
  }
}

/**
 * Determines if an error should be retried based on its status code
 */
export function isRetryableStatus(status: number): boolean {
  return [429, 500, 502, 503, 504].includes(status);
}

/**
 * Creates a standardized error message from a Sikka API response
 */
export function createErrorMessage(
  error: AxiosError,
  defaultMessage: string,
): string {
  const response = error.response?.data;
  return (
    response?.error?.message ||
    response?.message ||
    error.message ||
    defaultMessage
  );
}

/**
 * Logs a Sikka API error with relevant details
 */
export function logSikkaError(
  error: Error,
  details: SikkaErrorDetails,
  agentType: DentalAgentType = DentalAgentType.SIKKA,
): void {
  console.error({
    timestamp: new Date().toISOString(),
    type: error.name,
    message: error.message,
    agentType,
    ...details,
    stack: error.stack,
  });
}
