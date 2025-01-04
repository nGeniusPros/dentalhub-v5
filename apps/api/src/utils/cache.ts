import NodeCache from 'node-cache';

interface CacheOptions {
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum number of items in the cache
}

class CacheManager {
  private cache: NodeCache;

  constructor(options?: CacheOptions) {
    this.cache = new NodeCache({
      stdTTL: options?.ttl || 60, // Default TTL of 1 minute
      maxKeys: options?.maxSize,
    });
  }

  async get<T>(key: string, fetchFunction: () => Promise<T>): Promise<T> {
    const cachedValue = this.cache.get<T>(key);
    if (cachedValue) {
      return cachedValue;
    }

    const value = await fetchFunction();
    this.cache.set(key, value);
    return value;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, ttl);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getCacheStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
}

export const apiCache = new CacheManager({ ttl: 60, maxSize: 1000 }); // Default API cache
export const dbCache = new CacheManager({ ttl: 300, maxSize: 500 }); // Default DB cache
export const edgeCache = new CacheManager({ ttl: 300, maxSize: 500 }); // Default edge function cache
export default CacheManager;