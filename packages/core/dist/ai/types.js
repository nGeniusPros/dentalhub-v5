import { z } from 'zod';
// Agent Types
export var DentalAgentType;
(function (DentalAgentType) {
    DentalAgentType["BRAIN_CONSULTANT"] = "BRAIN_CONSULTANT";
    DentalAgentType["DATA_RETRIEVAL"] = "DATA_RETRIEVAL";
    DentalAgentType["PROFITABILITY"] = "PROFITABILITY";
    DentalAgentType["ANALYSIS"] = "ANALYSIS";
    DentalAgentType["PATIENT_CARE"] = "PATIENT_CARE";
    DentalAgentType["OPERATIONS"] = "OPERATIONS";
})(DentalAgentType || (DentalAgentType = {}));
// Agent Configuration
export const AgentConfigSchema = z.object({
    model: z.string().default('gpt-4-turbo-preview'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().positive().default(1000),
    systemPrompt: z.string().default('You are a dental health AI assistant')
});
// Message Types
export const AgentMessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    metadata: z.record(z.unknown()).optional()
});
// Response Types
export const AgentResponseSchema = z.object({
    content: z.string(),
    tokens: z.number().nonnegative(),
    metadata: z.record(z.unknown()).optional()
});
// Thread Types
export const ThreadMessageSchema = z.object({
    id: z.string(),
    threadId: z.string(),
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    createdAt: z.date().optional(),
    metadata: z.record(z.unknown()).optional()
});
// Assistant Types
export const AssistantMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    metadata: z.record(z.unknown()).optional()
});
export const AssistantResponseSchema = z.object({
    content: z.string(),
    metadata: z.object({
        usage: z.object({
            total_tokens: z.number(),
            completion_tokens: z.number().optional(),
            prompt_tokens: z.number().optional()
        }),
        model: z.string()
    })
});
//# sourceMappingURL=types.js.map