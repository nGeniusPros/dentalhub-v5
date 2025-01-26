import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../types/errors';
import { ErrorCode } from '../types/errors';
import OpenAPIValidator from 'express-openapi-validator';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const openapiValidator = OpenAPIValidator.middleware({
  apiSpec: path.join(__dirname, '../openapi/openapi.yaml'),
  validateRequests: true,
  validateResponses: true,
  validateSecurity: false, // We handle auth separately
  validateFormats: 'full',
  formats: {
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
});

export function handleValidationError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.status === 400) {
    const error = new ServiceError(
      ErrorCode.VALIDATION_ERROR,
      'Request validation failed',
      {
        path: err.path,
        message: err.message,
        errors: err.errors,
      }
    );
    return res.status(400).json(error.toJSON());
  }

  if (err.status === 404) {
    const error = new ServiceError(
      ErrorCode.RESOURCE_NOT_FOUND,
      'API endpoint not found',
      {
        path: req.path,
        method: req.method,
      }
    );
    return res.status(404).json(error.toJSON());
  }

  next(err);
}
