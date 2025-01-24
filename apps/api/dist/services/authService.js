export class AuthService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async login(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                return { user: null, error };
            }
            return {
                user: data.user,
                accessToken: data.session?.access_token,
                refreshToken: data.session?.refresh_token
            };
        }
        catch (error) {
            return { user: null, error: error };
        }
    }
    async getCurrentUser(accessToken) {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser(accessToken);
            if (error || !user) {
                return { user: null, error: error || new Error('User not found') };
            }
            // Return basic user info even if profile fetch fails
            const userProfile = {
                id: user.id,
                email: user.email || '',
                user_metadata: user.user_metadata || {},
                created_at: user.created_at,
                updated_at: user.updated_at || user.created_at
            };
            return { user: userProfile };
        }
        catch (error) {
            console.error('Error in getCurrentUser:', error);
            return { user: null, error: error };
        }
    }
    async updateCurrentUser(user_metadata) {
        try {
            const { data: user, error } = await this.supabase.auth.getUser();
            if (error) {
                return { user: null, error };
            }
            const { data: profile, error: profileError } = await this.supabase
                .from('users')
                .update({ user_metadata })
                .eq('id', user.user?.id)
                .select()
                .single();
            if (profileError) {
                return { user: null, error: profileError };
            }
            return { user: profile };
        }
        catch (error) {
            return { user: null, error: error };
        }
    }
    async refreshSession(refreshToken) {
        try {
            const { data, error } = await this.supabase.auth.refreshSession({
                refresh_token: refreshToken,
            });
            if (error) {
                return { session: null, error };
            }
            return { session: data.session };
        }
        catch (error) {
            return { session: null, error: error };
        }
    }
}
