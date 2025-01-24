import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
}
export interface AuthenticatedRequest extends Request {
    supabase: SupabaseClient<Database>;
    user?: AuthenticatedUser;
}
export declare const requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
