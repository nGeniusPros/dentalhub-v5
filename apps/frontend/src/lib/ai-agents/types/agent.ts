export interface Agent {
  id: string;
  processQuery(query: string): Promise<AgentResponse>;
}

export interface AgentConfig {
  id: string;
  apiKey: string;
  rateLimit: RateLimitConfig;
  cacheTTL: number;
}

export interface RateLimitConfig {
  rpm: number;
  tpm: number;
}

export interface AgentResponse {
  content: string;
  metadata: {
    dataQuality: number;
    sources: string[];
    executionTime: number;
  };
}