import { z } from 'zod';

// Agent Types
export enum DentalAgentType {
  BRAIN_CONSULTANT = 'BRAIN_CONSULTANT',
  DATA_RETRIEVAL = 'DATA_RETRIEVAL',
  PROFITABILITY = 'PROFITABILITY',
  ANALYSIS = 'ANALYSIS',
  PATIENT_CARE = 'PATIENT_CARE',
  OPERATIONS = 'OPERATIONS'
}

// Agent Configuration
export const AgentConfigSchema = z.object({
  model: z.string().default('gpt-4-turbo-preview'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(1000),
  systemPrompt: z.string().default('You are a dental health AI assistant')
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Agent Context
export interface AgentContext {
  patientId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

// Message Types
export const AgentMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  metadata: z.record(z.unknown()).optional()
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

// Response Types
export const AgentResponseSchema = z.object({
  content: z.string(),
  tokens: z.number().nonnegative(),
  metadata: z.record(z.unknown()).optional()
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

// Thread Types
export const ThreadMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  createdAt: z.date().optional(),
  metadata: z.record(z.unknown()).optional()
});

export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;

// Assistant Types
export const AssistantMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  metadata: z.record(z.unknown()).optional()
});

export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;

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

export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;