import { AIResponse } from '../types/agent-types';

interface CachedItem {
  response: AIResponse;
  timestamp: number;
}

export class ResponseCache {
  private static instance: ResponseCache;
  private cache = new Map<string, CachedItem>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {}

  public static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache();
    }
    return ResponseCache.instance;
  }

  async getOrCompute(
    key: string,
    compute: () => Promise<AIResponse>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<AIResponse> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.response;
    }

    const response = await compute();
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });

    return response;
  }

  clear(): void {
    this.cache.clear();
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
