import { createClient } from "redis";
import { InfrastructureError } from "./errors/index.js";

type RedisClientType = ReturnType<typeof createClient>;

export class RedisClient {
  private client: RedisClientType;
  private connectionAttempts = 0;
  private readonly MAX_RETRIES = 3;

  constructor(private url: string) {
    this.client = createClient({
      url,
      pingInterval: 30000, // 30 seconds
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on("error", (err: Error) => {
      throw new InfrastructureError("redis_connection", err, {
        connectionUrl: this.url,
        attempt: this.connectionAttempts,
      });
    });

    this.client.on("reconnecting", () => {
      this.connectionAttempts++;
      if (this.connectionAttempts > this.MAX_RETRIES) {
        throw new InfrastructureError("redis_retry_limit", null, {
          maxRetries: this.MAX_RETRIES,
        });
      }
    });
  }

  async connect(): Promise<RedisClientType> {
    try {
      await this.client.connect();
      return this.client;
    } catch (error) {
      if (error instanceof Error) {
        throw new InfrastructureError("redis_connect", error, {
          connectionUrl: this.url,
        });
      }
      throw new InfrastructureError("redis_connect", null, {
        connectionUrl: this.url,
        error: String(error),
      });
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error) {
      if (error instanceof Error) {
        throw new InfrastructureError("redis_disconnect", error, {
          connectionUrl: this.url,
        });
      }
      throw new InfrastructureError("redis_disconnect", null, {
        connectionUrl: this.url,
        error: String(error),
      });
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const ping = await this.client.ping();
      return ping === "PONG";
    } catch (error) {
      if (error instanceof Error) {
        throw new InfrastructureError("redis_healthcheck", error);
      }
      throw new InfrastructureError("redis_healthcheck", null, {
        error: String(error),
      });
    }
  }
}

export function createRedisClient(url: string): RedisClient {
  return new RedisClient(url);
}
