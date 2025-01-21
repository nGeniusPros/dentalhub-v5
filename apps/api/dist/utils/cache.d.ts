import NodeCache from 'node-cache';
interface CacheOptions {
    ttl: number;
    maxSize?: number;
}
declare class CacheManager {
    private cache;
    constructor(options?: CacheOptions);
    get<T>(key: string, fetchFunction: () => Promise<T>): Promise<T>;
    set<T>(key: string, value: T, ttl?: number): void;
    del(key: string): void;
    flush(): void;
    getCacheStats(): NodeCache.Stats;
}
export declare const apiCache: CacheManager;
export declare const dbCache: CacheManager;
export declare const edgeCache: CacheManager;
export default CacheManager;
