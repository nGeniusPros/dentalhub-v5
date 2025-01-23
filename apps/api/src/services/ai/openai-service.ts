import OpenAI from 'openai';
import { Redis } from 'ioredis';
import { rateLimit } from '@dental/core/middleware';
import { AiServiceError } from '@dental/core/ai/errors';
import { AgentMessage, AgentContext, AgentConfig } from '@dental/core/ai/types';

export class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI;
  private redis: Redis;

  private constructor() {
    // Initialize OpenAI client with API key from environment
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });

    // Initialize Redis for rate limiting
    this.redis = new Redis(process.env.REDIS_URL!, {
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  @rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  })
  async createChatCompletion(
    messages: AgentMessage[],
    config: Partial<AgentConfig>,
    context: AgentContext
  ) {
    try {
      const response = await this.client.chat.completions.create({
        messages,
        model: config.model || 'gpt-4-turbo-preview',
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        user: context.sessionId, // For tracking purposes
      });

      // Cache response if Redis is available
      if (context.sessionId) {
        await this.redis.setex(
          `chat:${context.sessionId}:${Date.now()}`,
          3600, // 1 hour
          JSON.stringify({
            response,
            metadata: context.metadata,
          })
        );
      }

      return response;
    } catch (error) {
      throw new AiServiceError('OpenAI API call failed', error);
    }
  }

  @rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  })
  async getThreadMessages(threadId: string) {
    try {
      const messages = await this.client.beta.threads.messages.list(threadId);
      return messages.data;
    } catch (error) {
      throw new AiServiceError('Failed to get thread messages', error);
    }
  }

  @rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  })
  async createThread() {
    try {
      return await this.client.beta.threads.create();
    } catch (error) {
      throw new AiServiceError('Failed to create thread', error);
    }
  }

  @rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  })
  async addMessageToThread(threadId: string, content: string) {
    try {
      return await this.client.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
      });
    } catch (error) {
      throw new AiServiceError('Failed to add message to thread', error);
    }
  }

  @rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  })
  async runAssistant(threadId: string, assistantId: string) {
    try {
      const run = await this.client.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });

      // Wait for completion with timeout
      const startTime = Date.now();
      const timeout = 30000; // 30 seconds
      let status = await this.client.beta.threads.runs.retrieve(threadId, run.id);
      
      while (
        (status.status === 'queued' || status.status === 'in_progress') &&
        Date.now() - startTime < timeout
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        status = await this.client.beta.threads.runs.retrieve(threadId, run.id);
      }

      if (status.status === 'completed') {
        return await this.getThreadMessages(threadId);
      } else {
        throw new Error(`Run failed with status: ${status.status}`);
      }
    } catch (error) {
      throw new AiServiceError('Failed to run assistant', error);
    }
  }
}