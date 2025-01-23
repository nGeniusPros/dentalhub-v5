import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIService } from '../../infrastructure/openai-service';
import { NetworkError } from '../../types/errors';

// Mock OpenAI client
vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      beta = {
        threads: {
          create: vi.fn().mockResolvedValue({ id: 'thread-123' }),
          messages: {
            create: vi.fn().mockResolvedValue({}),
            list: vi.fn().mockResolvedValue({
              data: [{
                role: 'assistant',
                content: [{ text: { value: 'Mock response' } }]
              }]
            })
          },
          runs: {
            create: vi.fn().mockResolvedValue({ id: 'run-123' }),
            retrieve: vi.fn().mockResolvedValue({ status: 'completed' })
          }
        }
      }
    }
  };
});

describe('OpenAIService', () => {
  let service: OpenAIService;

  beforeEach(() => {
    service = OpenAIService.getInstance();
  });

  it('should generate a response successfully', async () => {
    const response = await service.generateResponse(
      'test prompt',
      {
        assistantId: 'test-assistant',
        apiKey: 'test-key'
      },
      'DATA_RETRIEVAL'
    );

    expect(response).toBe('Mock response');
  });

  it('should handle network errors', async () => {
    // Mock a network error
    vi.spyOn(service as any, 'waitForCompletion')
      .mockRejectedValueOnce(new Error('Network error'));

    await expect(
      service.generateResponse(
        'test prompt',
        {
          assistantId: 'test-assistant',
          apiKey: 'test-key'
        },
        'DATA_RETRIEVAL'
      )
    ).rejects.toThrow(NetworkError);
  });

  it('should timeout after max attempts', async () => {
    // Mock a timeout scenario
    vi.spyOn(service as any, 'waitForCompletion')
      .mockRejectedValueOnce(new Error('Timeout waiting for completion'));

    await expect(
      service.generateResponse(
        'test prompt',
        {
          assistantId: 'test-assistant',
          apiKey: 'test-key'
        },
        'DATA_RETRIEVAL'
      )
    ).rejects.toThrow(NetworkError);
  });
});
