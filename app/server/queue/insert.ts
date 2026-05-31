import { v7 } from "uuid";
import { redisQueues } from "../cache/redis.services.js";
import { rabbitmq } from "../providers/rabbitmq.js";

export async function insertInQueue<t>(payload: Omit<QueuePayload<t>, 'proccessId'>) {

    const {
        channel
    } = rabbitmq;

    const uuid = v7();

    await redisQueues.set(uuid, {
        status: 'pendent',
        retrys: 0,
        error: null,
    });

    await channel.sendToQueue(
        payload.queue,
        Buffer.from(
            JSON.stringify({
                ...payload,
                proccessId: uuid,
            } as QueuePayload<t>)
        ),
        {
            persistent: true
        }
    );
}