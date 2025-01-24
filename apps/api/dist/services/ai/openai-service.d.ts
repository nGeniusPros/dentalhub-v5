import OpenAI from 'openai';
import { AgentMessage, AgentContext, AgentConfig } from '@dental/core/ai/types';
export declare class OpenAIService {
    private static instance;
    private client;
    private redis;
    private constructor();
    static getInstance(): OpenAIService;
    createChatCompletion(messages: AgentMessage[], config: Partial<AgentConfig>, context: AgentContext): Promise<OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string | null;
    }>;
    getThreadMessages(threadId: string): Promise<OpenAI.Beta.Threads.Messages.Message[]>;
    createThread(): Promise<OpenAI.Beta.Threads.Thread & {
        _request_id?: string | null;
    }>;
    addMessageToThread(threadId: string, content: string): Promise<OpenAI.Beta.Threads.Messages.Message & {
        _request_id?: string | null;
    }>;
    runAssistant(threadId: string, assistantId: string): Promise<OpenAI.Beta.Threads.Messages.Message[]>;
}
