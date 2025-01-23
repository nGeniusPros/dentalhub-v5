import { AIResponse } from '../types/agent-types';

interface CachedItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ResponseCache {
  private static instance: ResponseCache;
  private cache = new Map<string, CachedItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {}

  public static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache();
    }
    return ResponseCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.remove(key);
      return null;
    }

    return cached.data as T;
  }

  async set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const computed = await compute();
    await this.set(key, computed, ttl);
    return computed;
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

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.remove(key);
      }
    }
  }
}
