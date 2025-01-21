import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
export declare class AuthService {
    private supabase;
    constructor(supabase: SupabaseClient<Database>);
    login(email: string, password: string): Promise<{
        user: any;
        accessToken: string | undefined;
        refreshToken: string | undefined;
        error?: Error;
    }>;
    getCurrentUser(accessToken: string): Promise<any>;
    updateCurrentUser(user_metadata: any): Promise<any>;
    refreshSession(refreshToken: string): Promise<{
        session: Session | null;
        error: any;
    }>;
}
