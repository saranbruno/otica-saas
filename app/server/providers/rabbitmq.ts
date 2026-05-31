import amqp from "amqplib";

let cachedConnection: amqp.ChannelModel | null = null;
let cachedChannel: amqp.Channel | null = null;
let connecting: Promise<{ connection: amqp.ChannelModel, channel: amqp.Channel }> | null = null;

export async function connectRabbitMQ(): Promise<{ connection: amqp.ChannelModel, channel: amqp.Channel }> {
    const url = process.env.RABBITMQ_URL;

    if (!url) {
        throw new Error('RABBITMQ_URL não configurada');
    }

    if (cachedConnection && cachedChannel) {
        return {
            connection: cachedConnection,
            channel: cachedChannel,
        };
    }

    if (connecting) {
        return connecting;
    }

    connecting = (async () => {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        connection.on('close', () => {
            cachedConnection = null;
            cachedChannel = null;
            connecting = null;
        });

        connection.on('error', () => {
            cachedConnection = null;
            cachedChannel = null;
            connecting = null;
        });

        channel.on('close', () => {
            cachedChannel = null;
            connecting = null;
        });

        channel.on('error', () => {
            cachedChannel = null;
            connecting = null;
        });

        cachedConnection = connection;
        cachedChannel = channel;

        return { connection, channel };
    })();

    try {
        return await connecting;
    } catch (error) {
        connecting = null;
        cachedConnection = null;
        cachedChannel = null;
        throw error;
    }
}

export const rabbitmq = await connectRabbitMQ();