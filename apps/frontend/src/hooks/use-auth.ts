import { useState, useCallback, useEffect } from "react";
import { supabaseService } from "../services/supabase";
import type { User } from "../types";
import { convertSupabaseUser } from "../lib/utils";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabaseService.auth.getSession().then((session) => {
      if (session) {
        supabaseService.auth.getUser().then((response) => {
          if (response.data?.user) {
            setUser(convertSupabaseUser(response.data.user));
          }
        });
      }
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseService.auth.signInWithPassword(
        email,
        password,
      );
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        setUser(convertSupabaseUser(data.user as any));
      }
      return data.user as User;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabaseService.auth.signOut();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};
