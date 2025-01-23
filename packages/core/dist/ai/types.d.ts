import { z } from 'zod';
export declare const AgentConfigSchema: z.ZodObject<{
    model: z.ZodDefault<z.ZodString>;
    temperature: z.ZodDefault<z.ZodNumber>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
    systemPrompt: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
}, {
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    systemPrompt?: string | undefined;
}>;
export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export interface AgentContext {
    patientId: string;
    sessionId: string;
    metadata: Record<string, unknown>;
}
export declare const AgentResponseSchema: z.ZodObject<{
    content: z.ZodString;
    tokens: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    tokens: number;
    metadata?: Record<string, any> | undefined;
}, {
    content: string;
    tokens: number;
    metadata?: Record<string, any> | undefined;
}>;
