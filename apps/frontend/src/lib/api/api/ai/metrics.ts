import { NextApiRequest, NextApiResponse } from "next";
import { HeadBrainOrchestrator } from "../../../lib/ai-agents/orchestration/head-brain-orchestrator";
import { AgentError } from "../../../lib/ai-agents/types/errors";
import { AIMetricsRequest, AIMetricsResponse } from "./types";
import { withAuth } from "../../../middleware/auth";
import { rateLimit } from "../../../middleware/rate-limit";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIMetricsResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed",
      },
    } as AIMetricsResponse);
  }

  try {
    const { metrics, timeframe } = req.body as AIMetricsRequest;

    if (!metrics || !timeframe) {
      return res.status(400).json({
        error: {
          code: "INVALID_REQUEST",
          message: "Metrics and timeframe are required",
        },
      } as AIMetricsResponse);
    }

    const orchestrator = HeadBrainOrchestrator.getInstance();
    const analysis = await orchestrator.analyzeMetrics(metrics, timeframe);

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error("AI Metrics Error:", error);

    if (error instanceof AgentError) {
      return res.status(error.retryable ? 503 : 400).json({
        error: {
          code: error.code,
          message: error.message,
        },
      } as AIMetricsResponse);
    }

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    } as AIMetricsResponse);
  }
}

// Apply middleware
export default withAuth(
  rateLimit({
    limit: 30,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (req) => req.session?.user?.id || req.ip,
  })(handler),
);
