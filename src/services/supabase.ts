import supabase from '../lib/supabase/client';

export const supabaseService = {
  auth: {
    getSession: async () => {
      return await supabase.auth.getSession();
    },
    getUser: async () => {
      return await supabase.auth.getUser();
    },
    signInWithPassword: async (email: string, password: string) => {
      return await supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string) => {
      return await supabase.auth.signUp({ email, password });
    },
    signOut: async () => {
      return await supabase.auth.signOut();
    },
    resetPasswordForEmail: async (email: string) => {
      return await supabase.auth.resetPasswordForEmail(email);
    },
    updateUser: async (password: string) => {
      return await supabase.auth.updateUser({ password });
    },
    onAuthStateChange: (callback: any) => {
      return supabase.auth.onAuthStateChange(callback);
    }
  },
  from: (table: string) => {
    return {
      select: async (select: string) => {
        return await supabase.from(table).select(select);
      },
      insert: async (data: any) => {
        return await supabase.from(table).insert(data);
      },
      update: async (data: any) => {
        return await supabase.from(table).update(data);
      },
      delete: async () => {
        return await supabase.from(table).delete();
      }
    }
  },
  rpc: async (fn: string, args: any) => {
    return await supabase.rpc(fn, args);
  }
};