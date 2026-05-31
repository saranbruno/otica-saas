import { channel } from "node:diagnostics_channel";
import { rabbitmq } from "../providers/rabbitmq.js";
import { redisQueues } from "../cache/redis.services.js";

const queueNameEnv = process.env.QUEUE_NAME;
const prefetch = Number(process.env.WORKER_PREFETCH ?? 3);
const processTimeoutMs = Number(process.env.PROCESS_TIMEOUT_MS ?? 60000);

const allowedQueues: ChannelName[] = [''];

if (!queueNameEnv || !allowedQueues.includes(queueNameEnv as ChannelName)) {
    throw new Error('QUEUE_NAME inválida ou não configurada');
}

const queueName: ChannelName = queueNameEnv as ChannelName;

const handler = {
    '': async (any: any) => {}
}[queueName];

async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Timeout de processamento após ${timeoutMs}ms`));
        }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
}

async function startWorker(): Promise<void> {
    const { connection, channel } = rabbitmq;

    await channel.assertQueue(queueName, {
        durable: true,
    });

    await channel.prefetch(prefetch);

    console.log(`[worker] ${queueName} iniciado`);

    await channel.consume(
        queueName,
        async (data) => {
            if (!data) return;
            const payload: QueuePayload<any> = JSON.parse(data.content.toString());

            try {
                redisQueues.incrementRetry(payload.proccessId);

                await withTimeout(handler(payload), processTimeoutMs);

                channel.ack(data);
            } catch (error) {
                console.error('[worker] erro ao processar:', error);

                const statusInfo = (await redisQueues.get(payload.proccessId));
                const retrys = statusInfo?.retrys ?? 0;
                const errorMsg = statusInfo?.error ?? "Excedido a quantidade de tentativas";

                redisQueues.update(payload.proccessId, {
                    status: 'failed',
                    error: errorMsg,
                }, 86400);

                if (retrys > 2) {
                    channel.ack(data);
                } else {
                    channel.reject(data, true);
                }

                const isTimeout =
                    error instanceof Error &&
                    error.message.includes('Timeout de processamento');

                if (isTimeout) {
                    process.exit(1);
                }
            }
        },
        { noAck: false }
    );

    process.on('SIGTERM', async () => {
        console.log('[worker] encerrando...');

        await channel.close();
        await connection.close();

        process.exit(0);
    });
}

startWorker().catch((error) => {
    console.error('[worker] erro fatal:', error);
    process.exit(1);
});