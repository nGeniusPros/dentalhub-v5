import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../types/errors';
interface ApiError extends Error {
    code?: ErrorCode | string;
    statusCode?: number;
}
export declare const errorHandler: (err: ApiError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
