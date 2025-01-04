import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring';
import { ErrorCode } from '../types/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  MonitoringService.logError(err, err.code as ErrorCode || 'INTERNAL_ERROR', {
    method: req.method,
    route: req.originalUrl,
  });
  res.status(500).json({ error: 'Internal Server Error' });
};