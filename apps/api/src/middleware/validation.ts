import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ErrorCode } from "../types/errors";
import { logger } from "../lib/logger";
import { RetellWebhookEvent } from "@dentalhub/types";

// Generic validation middleware creator
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });

      if (!result.success) {
        logger.warn("Validation failed", {
          path: req.path,
          issues: result.error.issues,
        });

        return res.status(400).json({
          code: ErrorCode.INVALID_REQUEST_FORMAT,
          message: "Request validation failed",
          issues: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
          docs: "https://docs.dentalhub.com/errors/INVALID_REQUEST_FORMAT",
        });
      }

      req.validated = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Webhook signature validation middleware
export const validateWebhookSignature = (
  req: Request<{}, {}, RetellWebhookEvent>,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["x-retell-signature"];
  const timestamp = req.headers["x-retell-timestamp"];

  if (!signature || !timestamp) {
    return res.status(401).json({
      code: ErrorCode.INVALID_WEBHOOK_SIGNATURE,
      message: "Missing webhook signature or timestamp",
      docs: "https://docs.dentalhub.com/errors/INVALID_WEBHOOK_SIGNATURE",
    });
  }

  // TODO: Implement actual signature validation
  // const expectedSignature = createHmac('sha256', process.env.RETELL_WEBHOOK_SECRET)
  //   .update(timestamp + JSON.stringify(req.body))
  //   .digest('hex');

  // if (signature !== expectedSignature) {
  //   return res.status(401).json({
  //     code: ErrorCode.INVALID_WEBHOOK_SIGNATURE,
  //     message: 'Invalid webhook signature',
  //     docs: 'https://docs.dentalhub.com/errors/INVALID_WEBHOOK_SIGNATURE'
  //   });
  // }

  next();
};

// Common validation schemas
export const ValidationSchemas = {
  authLogin: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
  }),
  resourceIdParam: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  paginationQuery: z.object({
    query: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    }),
  }),
  retellWebhook: z.object({
    body: z.object({
      eventType: z.enum([
        "call.started",
        "call.ended",
        "call.transcription",
        "call.recording",
      ]),
      callId: z.string().uuid(),
      timestamp: z.string().datetime(),
      data: z.record(z.unknown()),
    }),
    headers: z.object({
      "x-retell-signature": z.string(),
      "x-retell-timestamp": z.string(),
    }),
  }),
};
