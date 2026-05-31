import { createServer } from "http";
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

dotenv.config();

const port = Number(process.env.SERVER_PORT);
const safePort = Number.isNaN(port) ? 80 : port;

export const api = express();
const httpServer = createServer(api);

export default async function setupApi(): Promise<void> {
    api.use(cors({
        origin: '*',
        credentials: true,
    }));

    api.use(express.json());

    const services: (() => Promise<void>)[] = [
        
    ];

    for (const service of services) {
        await service();
    }
}

setupApi();

httpServer.listen(safePort, "0.0.0.0", () => {
    console.log("Servidor rodando na porta:", safePort);
});