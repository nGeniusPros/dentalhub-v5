import { useState, useCallback } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock user data based on email
      const mockUsers: Record<string, User> = {
        'sarah.wilson@example.com': {
          id: '1',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@example.com',
          role: 'staff',
          title: 'Lead Dentist',
          department: 'General Dentistry'
        },
        'admin@example.com': {
          id: '2',
          name: 'Dr. Emily Parker',
          email: 'admin@example.com',
          role: 'admin',
          title: 'Practice Administrator',
          department: 'Administration'
        }
      };

      const mockUser = mockUsers[email];
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      setUser(mockUser);
      return mockUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout
  };
};