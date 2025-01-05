import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { createClient } from '@dentalhub/database';

export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient() as SupabaseClient<Database>;
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  async getUser() {
    return await this.supabase.auth.getUser();
  }

  async signInWithPassword(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async resetPasswordForEmail(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email);
  }

  async updateUser(password: string) {
    return await this.supabase.auth.updateUser({ password });
  }

  onAuthStateChange(callback: any) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  from(table: string) {
    return {
      select: async (select: string) => {
        return await this.supabase.from(table).select(select);
      },
      insert: async (data: any) => {
        return await this.supabase.from(table).insert(data);
      },
      update: async (data: any) => {
        return await this.supabase.from(table).update(data);
      },
      delete: async () => {
        return await this.supabase.from(table).delete();
      }
    };
  }

  async rpc(fn: string, args: any) {
    return await this.supabase.rpc(fn, args);
  }
}