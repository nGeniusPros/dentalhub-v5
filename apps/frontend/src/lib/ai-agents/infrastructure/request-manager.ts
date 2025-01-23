import { DentalAgentType } from '../types/agent-types';
import { RateLimitError } from '../types/errors';

class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly capacity: number,
    private readonly refillRate: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  tryConsume(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refill = (timePassed / 1000) * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + refill);
    this.lastRefill = now;
  }
}

export class RequestManager {
  private static instance: RequestManager;
  private tokenBuckets = new Map<DentalAgentType, TokenBucket>();

  private constructor() {
    // Initialize with default rate limits
    Object.values(DentalAgentType).forEach(agentType => {
      this.tokenBuckets.set(agentType as DentalAgentType, new TokenBucket(60, 1)); // 60 requests per minute
    });
  }

  public static getInstance(): RequestManager {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  async executeWithRateLimit<T>(
    agentType: DentalAgentType,
    fn: () => Promise<T>
  ): Promise<T> {
    const bucket = this.tokenBuckets.get(agentType);
    if (!bucket) {
      throw new Error(`No rate limiter configured for ${agentType}`);
    }

    if (!bucket.tryConsume()) {
      throw new RateLimitError(agentType);
    }

    return fn();
  }

  updateRateLimit(agentType: DentalAgentType, rpm: number): void {
    this.tokenBuckets.set(agentType, new TokenBucket(rpm, rpm / 60));
  }
}
