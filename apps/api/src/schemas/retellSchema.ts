import { z } from "zod";

export const RetellCallSchema = z.object({
  agent_id: z.string().uuid(),
  phone_number: z.string().regex(/^\+[1-9]\d{1,14}$/),
  metadata: z.record(z.unknown()).optional(),
});

export type RetellCallRequest = z.infer<typeof RetellCallSchema>;
