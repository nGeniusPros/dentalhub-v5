import { BaseAgent } from './base-agent';
import { AIResponse, DentalAgentType } from '../types/agent-types';
import { ValidationError } from '../types/errors';

interface DataRetrievalResponse extends AIResponse {
  metadata: {
    dataQuality: number;
    source: string;
    timestamp: number;
    queryType: string;
  };
}

export class DataRetrievalAgent extends BaseAgent {
  constructor(config: { id: string; apiKey: string }) {
    super(
      {
        id: config.id,
        apiKey: config.apiKey,
        rateLimit: { rpm: 60, tpm: 150000 }
      },
      'DATA_RETRIEVAL'
    );
  }

  async processQuery(query: string): Promise<DataRetrievalResponse> {
    const cacheKey = `data-retrieval:${query}`;
    
    return this.responseCache.getOrCompute(cacheKey, async () => {
      return this.executeWithRetry(async () => {
        // TODO: Implement actual OpenAI call here
        const mockResponse = {
          content: `Processed data for query: ${query}`,
          metadata: {
            dataQuality: 0.95,
            source: 'dental_records',
            timestamp: Date.now(),
            queryType: 'patient_history'
          }
        };

        return this.validateDataRetrievalResponse(mockResponse);
      });
    });
  }

  private validateDataRetrievalResponse(response: unknown): DataRetrievalResponse {
    const baseResponse = this.validateResponse(response);
    const typedResponse = response as Record<string, unknown>;
    
    if (!typedResponse.metadata?.dataQuality || 
        typeof typedResponse.metadata.dataQuality !== 'number') {
      throw new ValidationError(
        'DATA_RETRIEVAL',
        'Response must contain a dataQuality score'
      );
    }

    return {
      ...baseResponse,
      metadata: {
        dataQuality: typedResponse.metadata.dataQuality,
        source: String(typedResponse.metadata.source || 'unknown'),
        timestamp: Number(typedResponse.metadata.timestamp || Date.now()),
        queryType: String(typedResponse.metadata.queryType || 'unknown')
      }
    };
  }
}
