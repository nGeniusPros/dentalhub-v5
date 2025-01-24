import { SupabaseClient, Session, User, AuthError } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
interface AuthResponse {
    user: User | null;
    accessToken?: string;
    refreshToken?: string;
    error?: Error;
}
interface UserProfile {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}
export declare class AuthService {
    private supabase;
    constructor(supabase: SupabaseClient<Database>);
    login(email: string, password: string): Promise<AuthResponse>;
    getCurrentUser(accessToken: string): Promise<{
        user: UserProfile | null;
        error?: Error;
    }>;
    updateCurrentUser(user_metadata: any): Promise<{
        user: UserProfile | null;
        error?: Error;
    }>;
    refreshSession(refreshToken: string): Promise<{
        session: Session | null;
        error?: AuthError;
    }>;
}
export {};
