import { AuthError, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  data: {
    user: Database["auth"]["Tables"]["users"]["Row"] | null;
    session: any;
  } | null;
  error: AuthError | null;
}

// Auth functions
export async function signIn(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
}

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

// Database and Storage API
export const api = {
  from: <T extends keyof Database["public"]["Tables"]>(table: T) =>
    supabase.from(table),
  storage: {
    from: (bucket: string) => supabase.storage.from(bucket),
  },
  auth: {
    onAuthStateChange: (
      callback: Parameters<SupabaseClient["auth"]["onAuthStateChange"]>[0],
    ) => supabase.auth.onAuthStateChange(callback),
    getSession: () => supabase.auth.getSession(),
    getUser: () => supabase.auth.getUser(),
    signOut: () => supabase.auth.signOut(),
    signIn: (credentials: AuthCredentials) =>
      supabase.auth.signInWithPassword(credentials),
  },
  rpc: (fn: string, args?: Record<string, unknown>) => supabase.rpc(fn, args),
};
