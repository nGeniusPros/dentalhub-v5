import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import type { SupabaseClient, User } from '@supabase/supabase-js';

let instance: SupabaseClient<Database> | null = null;

function createSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: window.localStorage
    }
  });
}

function getSupabaseClient(): SupabaseClient<Database> {
  if (!instance) {
    instance = createSupabaseClient();
  }
  return instance;
}

// Auth methods
export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session }, error } = await getSupabaseClient().auth.getSession();
  return { session, error };
}

export async function getUser(): Promise<{ user: User | null; error: Error | null }> {
  const { data: { user }, error } = await getSupabaseClient().auth.getUser();
  return { user, error: error as Error | null };
}

// Database methods
export const supabaseService = {
  from: <T extends keyof Database['public']['Tables']>(table: T) => getSupabaseClient().from(table),
  storage: {
    from: (bucket: string) => getSupabaseClient().storage.from(bucket),
  },
  auth: {
    onAuthStateChange: (callback: (event: string, session: any) => void) => 
      getSupabaseClient().auth.onAuthStateChange(callback),
    getSession: () => getSupabaseClient().auth.getSession(),
    getUser: () => getSupabaseClient().auth.getUser(),
    signOut: () => getSupabaseClient().auth.signOut(),
    signInWithPassword: (credentials: { email: string; password: string }) => 
      getSupabaseClient().auth.signInWithPassword(credentials),
  },
  rpc: (fn: string, args?: Record<string, unknown>) => getSupabaseClient().rpc(fn, args),
};