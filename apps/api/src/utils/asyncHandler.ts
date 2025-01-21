import { Request, Response, NextFunction } from 'express';
import { AsyncHandler } from '../types/common';

export const asyncHandler = <T = void>(fn: AsyncHandler<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };