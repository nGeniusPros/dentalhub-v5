import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';
import { ErrorCode } from '../types/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error with request details
  logger.error('API Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    user: (req as any).user?.id
  });

  // Handle specific error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Authentication required',
      code: ErrorCode.UNAUTHORIZED
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
      code: ErrorCode.VALIDATION_ERROR
    });
  }

  // Default error response
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    code: ErrorCode.INTERNAL_ERROR
  });
};