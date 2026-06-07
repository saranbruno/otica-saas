import { createServer } from "http";
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import CompaniesRoutes from "./interfaces/http/modules/companies/companies.routes.js";
import StoresRoutes from "./interfaces/http/modules/stores/stores.routes.js";
import UsersRoutes from "./interfaces/http/modules/users/users.routes.js";
import AuthenticationRoutes from "./interfaces/http/modules/authentication/authentication.routes.js";
import UserStoreAccessRoutes from "./interfaces/http/modules/user_store_access/user_store_access.routes.js";

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
        CompaniesRoutes,
        StoresRoutes,
        UsersRoutes,
        UserStoreAccessRoutes,
        AuthenticationRoutes,
    ];

    for (const service of services) {
        await service();
    }
}

setupApi();

httpServer.listen(safePort, "0.0.0.0", () => {
    console.log("Servidor rodando na porta:", safePort);
});
