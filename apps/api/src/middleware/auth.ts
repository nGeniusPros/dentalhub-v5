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
    // Get the token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.access_token;

    if (!accessToken) {
      logger.warn('No access token provided');
      return res.status(401).json({
        error: 'Authentication required',
        code: ErrorCode.UNAUTHORIZED,
      });
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await req.supabase.auth.getUser(accessToken);

    if (error) {
      logger.error('Supabase auth error:', error);
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: ErrorCode.UNAUTHORIZED,
      });
    }

    if (!user) {
      logger.warn('No user found for token');
      return res.status(401).json({
        error: 'User not found',
        code: ErrorCode.UNAUTHORIZED,
      });
    }

    // Validate and map user properties
    if (!user.email || !user.id) {
      logger.error('Invalid user payload from Supabase:', user);
      throw new Error('Invalid authentication payload');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user'
    };
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    next(error);
  }
};
