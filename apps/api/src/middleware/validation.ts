import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().min(3),
  type: z.enum(['voice', 'sms', 'email']),
  audience: z.object({
    filters: z.record(z.any())
  }),
  content: z.object({
    template: z.string().min(10)
  }),
  schedule: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    timezone: z.string()
  }).optional(),
  settings: z.object({
    retryCount: z.number().optional(),
    retryDelay: z.number().optional(),
    callbackUrl: z.string().url().optional()
  }).optional(),
  metadata: z.record(z.any()).optional()
});

export const validateCampaign = (req: Request, res: Response, next: NextFunction) => {
  try {
    campaignSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

export const validateWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement webhook signature validation
  next();
};