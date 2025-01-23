import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { ErrorCode } from '../types/errors';
import logger from '../lib/logger';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: AuthenticatedUser;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify Supabase client exists
    if (!req.supabase) {
      logger.error('Supabase client missing in request');
      return res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc9457#section-5.1',
        title: 'Server configuration error',
        status: 500,
        detail: 'Authentication system unavailable'
      });
    }

    // Token extraction with validation
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.cookies.access_token;
    
    if (!token) {
      logger.warn('Authentication attempt without token');
      return res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc9457#section-4.1',
        title: 'Authentication required',
        status: 401
      });
    }

    // JWT format validation
    if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
      logger.warn('Invalid token format detected');
      return res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc9457#section-4.1',
        title: 'Invalid token format',
        status: 401
      });
    }

    // Supabase authentication with enhanced error handling
    const { data: { user }, error } = await req.supabase.auth.getUser(token);

    if (error) {
      logger.error('Supabase auth error:', error);
      return res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc9457#section-4.1',
        title: 'Authentication failed',
        status: 401,
        detail: error.message
      });
    }

    if (!user) {
      logger.warn('No user found for valid token');
      return res.status(404).json({
        type: 'https://tools.ietf.org/html/rfc9457#section-4.4',
        title: 'User not found',
        status: 404
      });
    }

    // Type-safe user metadata handling
    req.user = {
      id: user.id,
      email: user.email!,
      role: (user.user_metadata?.role as UserRole) || 'staff',
      practice_id: user.user_metadata?.practice_id || 'unknown'
    };

    next();
  } catch (error) {
    logger.error('Auth middleware failure:', error);
    return res.status(500).json({
      type: 'https://tools.ietf.org/html/rfc9457#section-5.1',
      title: 'Authentication system error',
      status: 500,
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
