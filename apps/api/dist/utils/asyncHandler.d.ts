import { Request, Response, NextFunction } from 'express';
import { AsyncHandler } from '../types/common';
export declare const asyncHandler: <T = void>(fn: AsyncHandler<T>) => (req: Request, res: Response, next: NextFunction) => void;
