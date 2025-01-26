import { AgentConfig, AgentContext, AIResponse, AgentMessage, AgentMetadata } from '../types/agent-types';

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected context: AgentContext;
  protected metadata: AgentMetadata;
  protected messageHistory: AgentMessage[] = [];
  protected maxHistoryLength = 10;

  constructor(config: AgentConfig) {
    this.config = config;
    this.context = {
      sessionData: {
        startTime: new Date().toISOString(),
        interactions: 0,
        lastInteraction: new Date().toISOString(),
      }
    };
    this.metadata = this.initializeMetadata();
  }

  protected abstract initializeMetadata(): AgentMetadata;
  protected abstract generateResponse(message: string): Promise<AIResponse>;

  public setContext(context: AgentContext) {
    this.context = {
      ...this.context,
      ...context,
      sessionData: {
        ...this.context.sessionData,
        ...context.sessionData,
        lastInteraction: new Date().toISOString(),
      }
    };
  }

  public async processMessage(message: string): Promise<AIResponse> {
    try {
      // Add user message to history
      this.addMessageToHistory({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });

      // Generate response
      const response = await this.generateResponse(message);

      // Add assistant message to history
      this.addMessageToHistory({
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        metadata: response.metadata,
      });

      return response;
    } catch (error) {
      const errorResponse: AIResponse = {
        content: 'An error occurred while processing your message.',
        error: {
          code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          retryable: true,
        },
      };
      return errorResponse;
    }
  }

  protected addMessageToHistory(message: AgentMessage) {
    this.messageHistory.push(message);
    if (this.messageHistory.length > this.maxHistoryLength) {
      this.messageHistory.shift();
    }
  }

  public getMessageHistory(): AgentMessage[] {
    return [...this.messageHistory];
  }

  public getMetadata(): AgentMetadata {
    return { ...this.metadata };
  }

  public getConfig(): Omit<AgentConfig, 'apiKey'> {
    const { apiKey, ...safeConfig } = this.config;
    return safeConfig;
  }

  protected async rateLimitRequest<T>(
    request: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('rate limit') &&
        retryCount < (this.config.retryConfig?.maxRetries || 3)
      ) {
        const backoffTime =
          (this.config.retryConfig?.initialDelay || 1000) *
          Math.pow(this.config.retryConfig?.backoffFactor || 2, retryCount);
        
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return this.rateLimitRequest(request, retryCount + 1);
      }
      throw error;
    }
  }

  protected formatError(error: unknown): AIResponse['error'] {
    if (error instanceof Error) {
      return {
        code: error.name,
        message: error.message,
        retryable: error.message.includes('rate limit') || error.message.includes('timeout'),
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      retryable: false,
    };
  }
}
