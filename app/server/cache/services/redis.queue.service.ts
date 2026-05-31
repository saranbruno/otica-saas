import type { RedisClient } from "../../providers/redis.js";

export class QueueRedisService {

    constructor(private readonly client: RedisClient) { }

    private readonly ttlInSeconds = 300;

    private getQueueKey(processId: string): string {
        return `queue:${processId}:status`;
    }

    async set(
        processId: string,
        data: QueueProcessStatus,
        ttlInSeconds = this.ttlInSeconds
    ): Promise<void> {
        await this.client.set(
            this.getQueueKey(processId),
            JSON.stringify(data),
            { EX: ttlInSeconds }
        );
    }

    async get(
        processId: string
    ): Promise<QueueProcessStatus | null> {
        const value = await this.client.get(this.getQueueKey(processId));

        if (!value) return null;

        return JSON.parse(value) as QueueProcessStatus;
    }

    async update(
        processId: string,
        partial: Partial<QueueProcessStatus>,
        ttlInSeconds = this.ttlInSeconds
    ): Promise<QueueProcessStatus> {
        const current = await this.get(processId);

        const updated: QueueProcessStatus = {
            status: partial.status ?? current?.status ?? 'pendent',
            retrys: partial.retrys ?? current?.retrys ?? 0,
            error: partial.error ?? current?.error ?? null,
        };

        await this.set(processId, updated, ttlInSeconds);

        return updated;
    }

    async incrementRetry(processId: string): Promise<QueueProcessStatus> {
        const current = await this.get(processId);

        const updated: QueueProcessStatus = {
            status: current?.status ?? 'pendent',
            retrys: (current?.retrys ?? 0) + 1,
            error: current?.error ?? null,
        };

        await this.set(processId, updated);

        return updated;
    }

    async delete(processId: string): Promise<void> {
        await this.client.del(this.getQueueKey(processId));
    }

    async exists(processId: string): Promise<boolean> {
        const exists = await this.client.exists(this.getQueueKey(processId));
        return exists === 1;
    }

    async validate(processId: string): Promise<boolean> {
        const statusInfo = (await this.get(processId));
        const status = statusInfo?.status;

        if (status && !(['pendent', 'failed'] as ProcessStages[]).includes(status)) {
            return false;
        }

        return true;
    }

    async validateIsNotProcessing(processId: string): Promise<boolean> {
        const statusInfo = (await this.get(processId));
        const status = statusInfo?.status;

        if (status && !(['pendent', 'failed', 'done'] as ProcessStages[]).includes(status)) {
            return false;
        }

        return true;
    }
}