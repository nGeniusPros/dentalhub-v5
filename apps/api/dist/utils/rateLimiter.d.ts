declare class RateLimiter {
    private lastRequestTime;
    private requestCount;
    checkLimit(): Promise<void>;
}
export declare const rateLimiter: RateLimiter;
export {};
