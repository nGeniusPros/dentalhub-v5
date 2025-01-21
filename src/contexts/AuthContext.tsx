import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseService } from '../services/supabase';
import { User } from '../types';
import { convertSupabaseUser } from '../lib/utils';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data: { session: initialSession }, error: initialError } = await supabaseService.auth.getSession();
        if (initialError) {
          setError(initialError.message);
        }
        if (initialSession?.user) {
          supabaseService.auth.getUser().then((response) => {
            if (response.data?.user) {
              setUser(convertSupabaseUser(response.data.user));
            }
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();

    const { data: { subscription } } = supabaseService.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        if (session?.user) {
          try {
            supabaseService.auth.getUser().then((response) => {
              if (response.data?.user) {
                setUser(convertSupabaseUser(response.data.user));
              }
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseService.auth.signInWithPassword(email, password);
      if (error) {
        throw new Error(error.message);
      }
      if (data?.user) {
        setUser(convertSupabaseUser(data.user as any));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseService.auth.signUp(email, password);
      if (error) {
        throw new Error(error.message);
      }
      if (data?.user) {
        setUser(convertSupabaseUser(data.user as any));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await supabaseService.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await supabaseService.auth.resetPasswordForEmail(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    setError(null);
    try {
      await supabaseService.auth.updateUser(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};