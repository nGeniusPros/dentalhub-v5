export declare class RedisClient {
    private url;
    private client;
    private connectionAttempts;
    private readonly MAX_RETRIES;
    constructor(url: string);
    private setupEventHandlers;
    connect(): Promise<any>;
    disconnect(): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare function createRedisClient(): RedisClient;
