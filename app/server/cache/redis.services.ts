import { redisConnection as redis } from "../providers/redis.js";
import { QueueRedisService } from "./services/redis.queue.service.js";

const client = redis.getClient();
await client.connect();

export const redisQueues = new QueueRedisService(client);

export { redis };