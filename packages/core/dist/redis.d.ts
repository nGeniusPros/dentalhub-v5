import { createClient } from "redis";
type RedisClientType = ReturnType<typeof createClient>;
export declare class RedisClient {
    private url;
    private client;
    private connectionAttempts;
    private readonly MAX_RETRIES;
    constructor(url: string);
    private setupEventHandlers;
    connect(): Promise<RedisClientType>;
    disconnect(): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare function createRedisClient(url: string): RedisClient;
export {};
