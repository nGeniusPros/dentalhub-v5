import { HeadBrainConsultant } from '../agents/head-brain-consultant';
import { RequestManager } from '../infrastructure/request-manager';
import { ResponseCache } from '../infrastructure/response-cache';
import { AgentConfig } from '../types/agent-types';
import { AgentError } from '../types/errors';

// Mock the environment variables
vi.mock('../../../config/env', () => ({
  config: {
    openai: {
      apiEndpoint: 'http://localhost:3000/api',
      assistantIds: {
        brainConsultant: 'asst_YEpG6gSfhbXQp5yzNueXGMK6'
      }
    }
  }
}));

describe('HeadBrainConsultant', () => {
  let consultant: HeadBrainConsultant;
  let mockRequestManager: jest.Mocked<RequestManager>;
  let mockResponseCache: jest.Mocked<ResponseCache>;

  const mockConfig: AgentConfig = {
    id: 'brain-consultant',
    assistantId: 'asst_YEpG6gSfhbXQp5yzNueXGMK6',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 1000,
    rateLimit: {
      rpm: 60,
      tpm: 90000
    },
    caching: {
      enabled: true,
      ttl: 3600
    }
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup mocks
    mockRequestManager = {
      executeWithRateLimit: vi.fn(),
      createAssistantMessage: vi.fn(),
      getAssistantThread: vi.fn(),
      getInstance: vi.fn().mockReturnThis()
    } as unknown as jest.Mocked<RequestManager>;

    mockResponseCache = {
      get: vi.fn(),
      set: vi.fn(),
      getOrCompute: vi.fn(),
      getInstance: vi.fn().mockReturnThis()
    } as unknown as jest.Mocked<ResponseCache>;

    // Create consultant instance
    consultant = new HeadBrainConsultant(mockConfig);
  });

  describe('processQuery', () => {
    it('should process a consultation request successfully', async () => {
      const request = {
        query: 'How can we improve patient retention?',
        context: {
          priority: 'high' as const,
          timeframe: '3 months',
          constraints: ['budget_limited', 'staff_constraints']
        },
        preferences: {
          detailLevel: 'detailed' as const,
          format: ['actionable_steps', 'metrics']
        }
      };

      const mockAgentResponse = {
        agentType: 'PATIENT_CARE',
        analysis: 'Detailed analysis of patient retention...',
        confidence: 0.85,
        recommendations: ['Implement follow-up system', 'Enhance communication'],
        metadata: { source: 'historical_data' }
      };

      mockRequestManager.executeWithRateLimit.mockImplementation(async (_, fn) => fn());
      mockRequestManager.createAssistantMessage.mockResolvedValueOnce({
        content: JSON.stringify(['PATIENT_CARE', 'MARKETING_COACHING'])
      });

      const expectedResponse = {
        summary: 'Analysis of patient retention strategies',
        recommendations: ['Implement follow-up system', 'Enhance communication'],
        prioritizedActions: [
          {
            action: 'Implement follow-up system',
            priority: 'high',
            impact: 'High patient retention',
            effort: 'Medium implementation effort'
          }
        ],
        agentResponses: [mockAgentResponse]
      };

      const result = await consultant.processQuery(request);
      expect(result).toMatchObject(expectedResponse);
    });

    it('should handle errors gracefully', async () => {
      const request = {
        query: 'Invalid query',
        context: {
          priority: 'low' as const,
          timeframe: 'immediate',
          constraints: []
        }
      };

      mockRequestManager.executeWithRateLimit.mockRejectedValueOnce(
        new AgentError(
          'Failed to process query',
          'BRAIN_CONSULTANT',
          'PROCESSING_ERROR',
          true
        )
      );

      await expect(consultant.processQuery(request)).rejects.toThrow(AgentError);
    });

    it('should use cached responses when available', async () => {
      const request = {
        query: 'Cached query',
        context: {
          priority: 'medium' as const,
          timeframe: '1 month',
          constraints: []
        }
      };

      const cachedResponse = {
        summary: 'Cached analysis',
        recommendations: ['Cached recommendation'],
        prioritizedActions: [],
        agentResponses: []
      };

      mockResponseCache.get.mockResolvedValueOnce(cachedResponse);

      const result = await consultant.processQuery(request);
      expect(result).toEqual(cachedResponse);
      expect(mockRequestManager.createAssistantMessage).not.toHaveBeenCalled();
    });
  });
});
