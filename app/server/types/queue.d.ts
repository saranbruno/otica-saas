
type ChannelName = '';

type ProcessStages = 'pendent' | 'processing' | 'done' | 'failed';

type QueuePayload<t> = {
    proccessId: string;
    queue: ChannelName;
    job: string;
    data: t;
}

type QueueProcessStatus = {
    status: ProcessStages
    retrys: number;
    error: string | null | unknown;
}