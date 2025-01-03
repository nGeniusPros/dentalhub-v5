import { ErrorRequestHandler } from 'express';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler: ErrorRequestHandler = (err: ApiError, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    url: req.url,
    method: req.method
  });

  // Handle Supabase errors
  if (err.code?.startsWith('PGRST')) {
    return res.status(400).json({
      message: 'Database error',
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle validation errors
  if (err.message.includes('Validation error')) {
    return res.status(400).json({
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle known errors with status codes
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle unknown errors
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
};