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

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async login(email: string, password: string): Promise<AuthResponse> {
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
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async getCurrentUser(accessToken: string): Promise<{ user: UserProfile | null; error?: Error }> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(accessToken);

      if (error || !user) {
        return { user: null, error: error || new Error('User not found') };
      }

      // Return basic user info even if profile fetch fails
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata || {},
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at
      };

      return { user: userProfile };
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return { user: null, error: error as Error };
    }
  }

  async updateCurrentUser(user_metadata: any): Promise<{ user: UserProfile | null; error?: Error }> {
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

      return { user: profile as UserProfile };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async refreshSession(refreshToken: string): Promise<{ session: Session | null; error?: AuthError }> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        return { session: null, error };
      }

      return { session: data.session };
    } catch (error) {
      return { session: null, error: error as AuthError };
    }
  }
}