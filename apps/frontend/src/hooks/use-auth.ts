import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json() as User;
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
								headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
					});

      if (!response.ok) {
        const errorData = await response.json();
							throw new Error(errorData.error || 'Login failed');
      }

      const userData = await response.json() as User;
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
						const response = await fetch('/api/auth/refresh', {
								method: 'POST',
						});
						if (!response.ok) {
								throw new Error('Failed to refresh session');
						}
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