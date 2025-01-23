import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { apiClient } from '../config/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: userData } = await apiClient.get<User>('/auth/me');
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: userData } = await apiClient.post<User>('/auth/login', {
        email,
        password,
      });
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    // Remove tokens from cookies or local storage
  }, []);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/auth/refresh');
      await fetchUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    refreshSession
  };
};