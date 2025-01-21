import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
interface AuthenticatedRequest extends Request {
    supabase: SupabaseClient<Database>;
    user?: {
        id: string;
        email: string;
        role: string;
    };
    cookies: {
        access_token?: string;
        refresh_token?: string;
    };
}
export declare const authenticationMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export {};
