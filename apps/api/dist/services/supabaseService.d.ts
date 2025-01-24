export declare class SupabaseService {
    private supabase;
    constructor();
    getSession(): Promise<{
        data: {
            session: import("@supabase/supabase-js").AuthSession;
        };
        error: null;
    } | {
        data: {
            session: null;
        };
        error: import("@supabase/supabase-js").AuthError;
    } | {
        data: {
            session: null;
        };
        error: null;
    }>;
    getUser(): Promise<import("@supabase/supabase-js").UserResponse>;
    signInWithPassword(email: string, password: string): Promise<import("@supabase/supabase-js").AuthTokenResponsePassword>;
    signUp(email: string, password: string): Promise<import("@supabase/supabase-js").AuthResponse>;
    signOut(): Promise<{
        error: import("@supabase/supabase-js").AuthError | null;
    }>;
    resetPasswordForEmail(email: string): Promise<{
        data: {};
        error: null;
    } | {
        data: null;
        error: import("@supabase/supabase-js").AuthError;
    }>;
    updateUser(password: string): Promise<import("@supabase/supabase-js").UserResponse>;
    onAuthStateChange(callback: any): {
        data: {
            subscription: import("@supabase/supabase-js").Subscription;
        };
    };
    from(table: string): {
        select: (select: string) => Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any[]>>;
        insert: (data: any) => Promise<import("@supabase/supabase-js").PostgrestSingleResponse<null>>;
        update: (data: any) => Promise<import("@supabase/supabase-js").PostgrestSingleResponse<null>>;
        delete: () => Promise<import("@supabase/supabase-js").PostgrestSingleResponse<null>>;
    };
    rpc(fn: string, args: any): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
}
