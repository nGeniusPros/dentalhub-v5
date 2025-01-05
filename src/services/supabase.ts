import { SupabaseService } from '../api/src/services/supabaseService';

const supabaseService = new SupabaseService();

export const supabase = {
  auth: {
    getSession: async () => {
      return await supabaseService.getSession();
    },
    getUser: async () => {
      return await supabaseService.getUser();
    },
    signInWithPassword: async (email: string, password: string) => {
      return await supabaseService.signInWithPassword(email, password);
    },
    signUp: async (email: string, password: string) => {
      return await supabaseService.signUp(email, password);
    },
    signOut: async () => {
      return await supabaseService.signOut();
    },
    resetPasswordForEmail: async (email: string) => {
      return await supabaseService.resetPasswordForEmail(email);
    },
    updateUser: async (password: string) => {
      return await supabaseService.updateUser(password);
    },
    onAuthStateChange: (callback: any) => {
      return supabaseService.onAuthStateChange(callback);
    }
  },
  from: (table: string) => {
    return supabaseService.from(table);
  },
  rpc: async (fn: string, args: any) => {
    return await supabaseService.rpc(fn, args);
  }
};