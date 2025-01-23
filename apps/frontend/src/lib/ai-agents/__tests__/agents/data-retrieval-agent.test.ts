import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataRetrievalAgent } from '../../agents/data-retrieval-agent';
import { RateLimitError, ValidationError } from '../../types/errors';

describe('DataRetrievalAgent', () => {
  let agent: DataRetrievalAgent;

  beforeEach(() => {
    agent = new DataRetrievalAgent({
      id: 'test-id',
      apiKey: 'test-key'
    });
  });

  it('should process a valid query', async () => {
    const response = await agent.processQuery('test query');
    
    expect(response).toMatchObject({
      content: expect.any(String),
      metadata: {
        dataQuality: expect.any(Number),
        source: expect.any(String),
        timestamp: expect.any(Number),
        queryType: expect.any(String)
      }
    });
  });

  it('should cache responses', async () => {
    const firstResponse = await agent.processQuery('cache test');
    const secondResponse = await agent.processQuery('cache test');
    
    expect(firstResponse).toEqual(secondResponse);
  });

  it('should handle rate limiting', async () => {
    // Mock rate limit exceeded
    vi.spyOn(agent as any, 'executeWithRetry').mockImplementationOnce(() => {
      throw new RateLimitError('DATA_RETRIEVAL');
    });

    await expect(agent.processQuery('rate limit test')).rejects.toThrow(RateLimitError);
  });

  it('should validate response format', async () => {
    // Mock invalid response
    vi.spyOn(agent as any, 'executeWithRetry').mockImplementationOnce(() => ({
      content: 123, // Invalid content type
      metadata: {
        dataQuality: 'high' // Invalid dataQuality type
      }
    }));

    await expect(agent.processQuery('invalid response test'))
      .rejects.toThrow(ValidationError);
  });
});
