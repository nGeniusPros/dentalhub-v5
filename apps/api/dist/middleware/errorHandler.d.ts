import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/common';
export declare const errorHandler: (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
