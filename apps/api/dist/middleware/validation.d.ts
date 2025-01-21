import { Request, Response, NextFunction } from 'express';
export declare const validateCampaign: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateWebhookSignature: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
