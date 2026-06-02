import type { Request, Response } from "express";
import { RequestErrorLog } from "../../../../utils/logger/requestError.js";
import getLogContent from "../../../../utils/logger/getLogContent.js";
import type { StoresService } from "./stores.service.js";

type IdParam = {
    id: string;
}

export class StoresController {
    constructor(
        private readonly storesService: StoresService
    ) { }

    index = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const stores = await this.storesService.list();

            res.status(200).json(stores);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "stores_index",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao buscar lojas.",
                error: message,
            });
        }
    }

    show = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {

            const store = await this.storesService.findById(
                req.params.id
            );

            if (!store) {
                res.status(404).json({
                    message: "Loja não encontrada"
                });

                return;
            }

            res.status(200).json(store);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "stores_show",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao buscar loja.",
                error: message,
            });
        }
    }

    store = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const store = await this.storesService.create(
                req.body
            );

            res.status(201).json(store);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "stores_create",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao criar loja.",
                error: message,
            });
        }
    }

    update = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            const store = await this.storesService.update(
                req.params.id,
                req.body
            );

            if (!store) {
                res.status(404).json({
                    message: "Loja não encontrada"
                });

                return;
            }

            res.status(200).json(store);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "stores_update",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao atualizar dados da loja.",
                error: message,
            });
        }
    }

    destroy = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            await this.storesService.delete(
                req.params.id
            );

            res.sendStatus(204);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "stores_delete",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao excluir a loja.",
                error: message,
            });
        }
    }
}