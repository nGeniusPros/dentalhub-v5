import { createClient } from 'redis';
import { InfrastructureError } from '../../api/src/errors.js';
export class RedisClient {
    constructor(url) {
        this.url = url;
        this.connectionAttempts = 0;
        this.MAX_RETRIES = 3;
        this.client = createClient({
            url,
            pingInterval: 30000, // 30 seconds
        });
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.client.on('error', (err) => {
            throw new InfrastructureError('redis_connection', err, {
                connectionUrl: this.url,
                attempt: this.connectionAttempts
            });
        });
        this.client.on('reconnecting', () => {
            this.connectionAttempts++;
            if (this.connectionAttempts > this.MAX_RETRIES) {
                throw new InfrastructureError('redis_retry_limit', null, {
                    maxRetries: this.MAX_RETRIES
                });
            }
        });
    }
    async connect() {
        try {
            await this.client.connect();
            return this.client;
        }
        catch (error) {
            throw new InfrastructureError('redis_connect', error, {
                connectionUrl: this.url
            });
        }
    }
    async disconnect() {
        try {
            await this.client.disconnect();
        }
        catch (error) {
            throw new InfrastructureError('redis_disconnect', error);
        }
    }
    async healthCheck() {
        try {
            const ping = await this.client.ping();
            return ping === 'PONG';
        }
        catch (error) {
            throw new InfrastructureError('redis_healthcheck', error);
        }
    }
}
export function createRedisClient() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    return new RedisClient(url);
}
