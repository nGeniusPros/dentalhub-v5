import { Request, Response, NextFunction } from 'express';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { AuthService } from '../services/authService';

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}

export const authenticationMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authService = new AuthService(req.supabase);
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken) {
    if (refreshToken) {
      try {
        const { session, error } = await authService.refreshSession(refreshToken);
        if (error) {
          throw new Error('Failed to refresh session');
        }

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('access_token', session?.access_token, {
          httpOnly: true,
          secure: isProduction,
          path: '/',
          sameSite: 'strict',
          maxAge: session?.expires_in
        });
        res.cookie('refresh_token', session?.refresh_token, {
          httpOnly: true,
          secure: isProduction,
          path: '/',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        if (!session?.access_token) {
          throw new Error('Access token not found in session.');
        }
        const { user, error: userError } = await authService.getCurrentUser(session.access_token);
        if(userError){
          throw new Error('Failed to get user');
        }

        req.user = user;
        return next();
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired refresh token' });
      }
    }
    return res.status(401).json({ error: 'Unauthorized: No access token provided' });
  }

  try {
    if (!accessToken) {
        throw new Error('Access token not found.');
      }
    const { user, error } = await authService.getCurrentUser(accessToken);
    if (error) {
      throw new Error('Failed to authenticate user');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid access token' });
  }
};