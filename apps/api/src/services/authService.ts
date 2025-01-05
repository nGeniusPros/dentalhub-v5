import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async login(email: string, password: string) {
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

    return user;
  }

  async getCurrentUser() {
    const { data: user, error } = await this.supabase.auth.getUser();

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

  async updateCurrentUser(user_metadata: any) {
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
}