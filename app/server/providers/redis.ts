// redis.client.ts
import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL ?? "";

export type RedisClient = RedisClientType;

export class RedisConnection {
    private client: RedisClient;

    constructor(url = redisUrl) {
        if (!url) throw new Error("Configure a url do Redis no env");

        this.client = createClient({ url });

        this.client.on("error", (err) => {
            console.error("Redis Client Error", err);
        });
    }

    async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    getClient(): RedisClient {
        return this.client;
    }

    async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.disconnect();
        }
    }
}

export const redisConnection = new RedisConnection();