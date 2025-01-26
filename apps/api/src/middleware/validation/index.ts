import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationSchema } from "./schemas";
import crypto from "crypto";

export { ValidationSchemas } from "./schemas";

export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export function validateRequest(schema: ValidationSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error));
      } else {
        next(error);
      }
    }
  };
}

export function validateWebhookSignature(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const signature = req.headers["x-webhook-signature"] as string;
  const timestamp = req.headers["x-webhook-timestamp"] as string;
  const body = JSON.stringify(req.body);

  if (!signature || !timestamp) {
    return res
      .status(401)
      .json({ error: "Missing webhook signature or timestamp" });
  }

  // Verify timestamp is recent (within 5 minutes)
  const timestampMs = parseInt(timestamp, 10);
  const now = Date.now();
  if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
    return res.status(401).json({ error: "Webhook timestamp is too old" });
  }

  // Get the appropriate secret based on the webhook source
  let secret: string;
  const webhookSource = req.path.split("/")[1]; // e.g., /retell/webhook -> retell
  switch (webhookSource) {
    case "retell":
      secret = process.env.RETELL_WEBHOOK_SECRET!;
      break;
    case "sikka":
      secret = process.env.SIKKA_WEBHOOK_SECRET!;
      break;
    case "openai":
      secret = process.env.OPENAI_WEBHOOK_SECRET!;
      break;
    default:
      return res.status(400).json({ error: "Invalid webhook source" });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  next();
}
