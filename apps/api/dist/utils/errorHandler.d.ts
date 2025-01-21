import { Response } from 'express';
interface ErrorResponse {
    code: string;
    message: string;
    details?: any;
}
export declare function handleError(error: unknown, res: Response): void;
export declare function createErrorResponse(code: string, message: string, details?: any): ErrorResponse;
export declare function isOperationalError(error: unknown): boolean;
export {};
