import { AxiosError } from 'axios';
import { DentalAgentType } from '@dental/core/ai/types';
import { SikkaErrorCode, SikkaErrorDetails } from '../../../../frontend/src/lib/ai-agents/types/errors';
/**
 * Extracts error details from an Axios error response
 */
export declare function extractErrorDetails(error: AxiosError): SikkaErrorDetails;
/**
 * Maps HTTP status codes to Sikka error codes
 */
export declare function mapHttpStatusToErrorCode(status: number): SikkaErrorCode;
/**
 * Determines if an error should be retried based on its status code
 */
export declare function isRetryableStatus(status: number): boolean;
/**
 * Creates a standardized error message from a Sikka API response
 */
export declare function createErrorMessage(error: AxiosError, defaultMessage: string): string;
/**
 * Logs a Sikka API error with relevant details
 */
export declare function logSikkaError(error: Error, details: SikkaErrorDetails, agentType?: DentalAgentType): void;
