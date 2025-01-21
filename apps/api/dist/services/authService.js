export class AuthService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        const { data: user, error: userError } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', data.user?.id)
            .single();
        if (userError) {
            throw userError;
        }
        return { user, accessToken: data.session?.access_token, refreshToken: data.session?.refresh_token };
    }
    async getCurrentUser(accessToken) {
        const { data: user, error } = await this.supabase.auth.getUser(accessToken);
        if (error) {
            throw error;
        }
        const { data: profile, error: profileError } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', user?.user?.id)
            .single();
        if (profileError) {
            throw profileError;
        }
        return profile;
    }
    async updateCurrentUser(user_metadata) {
        const { data: user, error } = await this.supabase.auth.getUser();
        if (error) {
            throw error;
        }
        const { data: profile, error: profileError } = await this.supabase
            .from('users')
            .update({ user_metadata })
            .eq('id', user?.user?.id)
            .select()
            .single();
        if (profileError) {
            throw profileError;
        }
        return profile;
    }
    async refreshSession(refreshToken) {
        const { data, error } = await this.supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) {
            throw error;
        }
        return { session: data.session, error };
    }
}
