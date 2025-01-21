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
    if (ttl !== undefined) {
      this.cache.set(key, value, ttl);
    } else {
      this.cache.set(key, value);
    }
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

// Read cache settings from environment variables with defaults
const API_CACHE_TTL = parseInt(process.env.API_CACHE_TTL || '60', 10);
const API_CACHE_MAX_SIZE = parseInt(process.env.API_CACHE_MAX_SIZE || '1000', 10);
const DB_CACHE_TTL = parseInt(process.env.DB_CACHE_TTL || '300', 10);
const DB_CACHE_MAX_SIZE = parseInt(process.env.DB_CACHE_MAX_SIZE || '500', 10);
const EDGE_CACHE_TTL = parseInt(process.env.EDGE_CACHE_TTL || '300', 10);
const EDGE_CACHE_MAX_SIZE = parseInt(process.env.EDGE_CACHE_MAX_SIZE || '500', 10);

// Initialize cache instances with environment variables
export const apiCache = new CacheManager({
  ttl: API_CACHE_TTL,
  maxSize: API_CACHE_MAX_SIZE
});

export const dbCache = new CacheManager({
  ttl: DB_CACHE_TTL,
  maxSize: DB_CACHE_MAX_SIZE
});

export const edgeCache = new CacheManager({
  ttl: EDGE_CACHE_TTL,
  maxSize: EDGE_CACHE_MAX_SIZE
});
export default CacheManager;