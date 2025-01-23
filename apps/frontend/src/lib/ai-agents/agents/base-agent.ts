import { DentalAgentType, AIResponse, AgentConfig } from '../types/agent-types';
import { AgentError, ValidationError } from '../types/errors';
import { RequestManager } from '../infrastructure/request-manager';
import { ResponseCache } from '../infrastructure/response-cache';

export abstract class BaseAgent {
  protected readonly requestManager: RequestManager;
  protected readonly responseCache: ResponseCache;

  constructor(
    protected readonly config: AgentConfig,
    protected readonly agentType: DentalAgentType
  ) {
    this.requestManager = RequestManager.getInstance();
    this.responseCache = ResponseCache.getInstance();
  }

  abstract processQuery(query: string): Promise<AIResponse>;

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.requestManager.executeWithRateLimit(
          this.agentType,
          operation
        );
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (error instanceof AgentError && !error.retryable) {
          throw error;
        }
        
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        await this.delay(Math.pow(2, attempt - 1) * 1000); // Exponential backoff
      }
    }

    throw lastError;
  }

  protected validateResponse(response: unknown): AIResponse {
    if (!response || typeof response !== 'object') {
      throw new ValidationError(this.agentType, 'Response must be an object');
    }

    const typedResponse = response as Record<string, unknown>;
    
    if (typeof typedResponse.content !== 'string') {
      throw new ValidationError(this.agentType, 'Response must contain a content string');
    }

    return {
      content: typedResponse.content,
      metadata: typedResponse.metadata as Record<string, unknown>,
      confidence: typedResponse.confidence as number,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
