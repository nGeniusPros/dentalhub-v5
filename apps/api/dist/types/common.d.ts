import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ErrorCodeType } from './errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
export interface ApiResponse<T> {
    data: T;
    meta: {
        timestamp: string;
        requestId: string;
    };
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        hasNextPage: boolean;
    };
}
export interface ErrorResponse extends Error {
    code: ErrorCodeType;
    message: string;
    statusCode?: number;
    details?: Record<string, unknown>;
}
export type AsyncHandler<T = void> = (req: Request, res: Response, next: NextFunction) => Promise<T>;
export interface SupabaseRequest extends Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
    supabase: SupabaseClient<Database>;
}
export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
