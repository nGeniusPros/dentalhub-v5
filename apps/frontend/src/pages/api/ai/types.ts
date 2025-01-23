import { PracticeMetrics, GenerationOptions } from '../../../lib/ai-agents/types/frontend-types';
import { DentalAgentType } from '../../../lib/ai-agents/types/agent-types';

export interface AIQueryRequest {
  query: string;
  metrics: PracticeMetrics;
  options?: GenerationOptions;
}

export interface AIQueryResponse {
  summary: string;
  recommendations: string[];
  metrics: Record<string, unknown>;
  agentsInvolved: DentalAgentType[];
  error?: {
    code: string;
    message: string;
  };
}

export interface AIMetricsRequest {
  metrics: PracticeMetrics;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface AIMetricsResponse {
  analysis: {
    trends: Record<string, number[]>;
    insights: string[];
    recommendations: string[];
  };
  error?: {
    code: string;
    message: string;
  };
}
