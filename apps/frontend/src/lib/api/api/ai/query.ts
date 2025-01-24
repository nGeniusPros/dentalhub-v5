import { NextApiRequest, NextApiResponse } from 'next';
import { HeadBrainOrchestrator } from '../../../lib/ai-agents/orchestration/head-brain-orchestrator';
import { AgentError } from '../../../lib/ai-agents/types/errors';
import { AIQueryRequest, AIQueryResponse } from './types';
import { withAuth } from '../../../middleware/auth';
import { rateLimit } from '../../../middleware/rate-limit';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIQueryResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST requests are allowed'
      }
    } as AIQueryResponse);
  }

  try {
    const { query, metrics, options } = req.body as AIQueryRequest;

    if (!query || !metrics) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Query and metrics are required'
        }
      } as AIQueryResponse);
    }

    const orchestrator = HeadBrainOrchestrator.getInstance();
    const result = await orchestrator.processQuery(query);

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI Query Error:', error);

    if (error instanceof AgentError) {
      return res.status(error.retryable ? 503 : 400).json({
        error: {
          code: error.code,
          message: error.message
        }
      } as AIQueryResponse);
    }

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    } as AIQueryResponse);
  }
}

// Apply middleware
export default withAuth(
  rateLimit({
    limit: 60,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (req) => req.session?.user?.id || req.ip
  })(handler)
);
