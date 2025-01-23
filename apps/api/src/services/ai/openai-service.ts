import OpenAI from 'openai';
import { AgentConfig, AgentContext } from '@dental/core/ai/types';
import { createRedisClient } from '@dental/core/redis';
import { rateLimit } from '@dental/core/middleware';

const redis = createRedisClient();

export class OpenAIService {
  private client: OpenAI;
  private static instance: OpenAIService;

  private constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
      timeout: 10000
    });
  }

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  @rateLimit({ windowMs: 60 * 1000, max: 100 })
  async createChatCompletion(
    messages: OpenAI.ChatCompletionMessage[],
    config: Partial<AgentConfig>,
    context: AgentContext
  ) {
    try {
      const validatedConfig = AgentConfigSchema.parse(config);
      
      return await this.client.chat.completions.create({
        messages,
        model: validatedConfig.model,
        temperature: validatedConfig.temperature,
        max_tokens: validatedConfig.maxTokens,
        stream: true
      });
    } catch (error) {
      throw new AiServiceError('OpenAI API call failed', error);
    }
  }
}