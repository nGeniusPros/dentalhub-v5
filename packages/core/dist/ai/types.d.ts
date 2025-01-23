import { z } from 'zod';
export declare enum DentalAgentType {
    BRAIN_CONSULTANT = "BRAIN_CONSULTANT",
    DATA_RETRIEVAL = "DATA_RETRIEVAL",
    PROFITABILITY = "PROFITABILITY",
    ANALYSIS = "ANALYSIS",
    PATIENT_CARE = "PATIENT_CARE",
    OPERATIONS = "OPERATIONS"
}
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
    patientId?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
}
export declare const AgentMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant" | "system";
    content: string;
    metadata?: Record<string, unknown> | undefined;
}, {
    role: "user" | "assistant" | "system";
    content: string;
    metadata?: Record<string, unknown> | undefined;
}>;
export type AgentMessage = z.infer<typeof AgentMessageSchema>;
export declare const AgentResponseSchema: z.ZodObject<{
    content: z.ZodString;
    tokens: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    tokens: number;
    metadata?: Record<string, unknown> | undefined;
}, {
    content: string;
    tokens: number;
    metadata?: Record<string, unknown> | undefined;
}>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
export declare const ThreadMessageSchema: z.ZodObject<{
    id: z.ZodString;
    threadId: z.ZodString;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant";
    content: string;
    id: string;
    threadId: string;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: Date | undefined;
}, {
    role: "user" | "assistant";
    content: string;
    id: string;
    threadId: string;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: Date | undefined;
}>;
export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;
export declare const AssistantMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant";
    content: string;
    metadata?: Record<string, unknown> | undefined;
}, {
    role: "user" | "assistant";
    content: string;
    metadata?: Record<string, unknown> | undefined;
}>;
export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;
export declare const AssistantResponseSchema: z.ZodObject<{
    content: z.ZodString;
    metadata: z.ZodObject<{
        usage: z.ZodObject<{
            total_tokens: z.ZodNumber;
            completion_tokens: z.ZodOptional<z.ZodNumber>;
            prompt_tokens: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            total_tokens: number;
            completion_tokens?: number | undefined;
            prompt_tokens?: number | undefined;
        }, {
            total_tokens: number;
            completion_tokens?: number | undefined;
            prompt_tokens?: number | undefined;
        }>;
        model: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        model: string;
        usage: {
            total_tokens: number;
            completion_tokens?: number | undefined;
            prompt_tokens?: number | undefined;
        };
    }, {
        model: string;
        usage: {
            total_tokens: number;
            completion_tokens?: number | undefined;
            prompt_tokens?: number | undefined;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    content: string;
    metadata: {
        model: string;
        usage: {
            total_tokens: number;
            completion_tokens?: number | undefined;
            prompt_tokens?: number | undefined;
        };
    };
}, {
    content: string;
    metadata: {
        model: string;
        usage: {
            total_tokens: number;
            completion_tokens?: number | undefined;
            prompt_tokens?: number | undefined;
        };
    };
}>;
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;
