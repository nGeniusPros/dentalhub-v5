import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ErrorCode } from '../types/errors.js';
import { logger } from '../lib/logger.js';

// Generic validation middleware creator
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      });

      if (!result.success) {
        logger.warn('Validation failed', {
          path: req.path,
          issues: result.error.issues
        });
        
        return res.status(400).json({
          code: ErrorCode.INVALID_REQUEST_FORMAT,
          message: 'Request validation failed',
          issues: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          })),
          docs: 'https://docs.dentalhub.com/errors/INVALID_REQUEST_FORMAT'
        });
      }

      // Attach validated data to request
      req.validated = result.data;
      next();
    } catch (err) {
      logger.error('Validation middleware error', { error: err });
      res.status(500).json({
        code: ErrorCode.SERVER_ERROR,
        message: 'Internal validation system error'
      });
    }
  };
};

// Common validation schemas
export const ValidationSchemas = {
  authLogin: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })
  }),
  resourceIdParam: z.object({
    params: z.object({
      id: z.string().uuid()
    })
  }),
  paginationQuery: z.object({
    query: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20)
    })
  })
};