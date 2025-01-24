import type { Agent, AgentConfig, AgentResponse } from '../types/agent';
import { RequestManager } from '../infrastructure/request-manager';
import { ResponseCache } from '../infrastructure/response-cache';

export class DataRetrievalAgent implements Agent {
  private requestManager: RequestManager;
  private responseCache: ResponseCache;

  public readonly id: string;

  constructor(private readonly config: AgentConfig) {
    this.id = config.id;
    this.requestManager = new RequestManager(config.rateLimit);
    this.responseCache = new ResponseCache(config.cacheTTL);
  }

  async processQuery(query: string): Promise<AgentResponse> {
    try {
      // Check cache first
      const cachedResponse = this.responseCache.get(query);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Process new request
      const response = await this.requestManager.handleRequest(query);
      this.responseCache.set(query, response);
      
      return {
        content: response.data,
        metadata: {
          dataQuality: this.calculateDataQuality(response),
          sources: response.sources,
          executionTime: response.duration
        }
      };
    } catch (error) {
      throw new Error(`Data retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateDataQuality(response: any): number {
    // Implementation would analyze response metrics
    return 0.95; // Simplified for example
  }
}
