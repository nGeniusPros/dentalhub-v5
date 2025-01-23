import { z } from 'zod';
export const AgentConfigSchema = z.object({
    model: z.string().default('gpt-4-turbo-preview'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().positive().default(1000),
    systemPrompt: z.string().default('You are a dental health AI assistant')
});
export const AgentResponseSchema = z.object({
    content: z.string(),
    tokens: z.number().nonnegative(),
    metadata: z.record(z.any()).optional()
});
