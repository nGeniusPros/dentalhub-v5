import {
  retellWebhookSchema,
  sikkaWebhookSchema,
  openaiWebhookSchema,
} from "./webhooks";

export const ValidationSchemas = {
  retellWebhook: retellWebhookSchema,
  sikkaWebhook: sikkaWebhookSchema,
  openaiWebhook: openaiWebhookSchema,
} as const;

export type ValidationSchema =
  (typeof ValidationSchemas)[keyof typeof ValidationSchemas];
