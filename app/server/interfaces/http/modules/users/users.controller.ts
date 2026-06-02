import type { Request, Response } from "express";
import { RequestErrorLog } from "../../../../utils/logger/requestError.js";
import getLogContent from "../../../../utils/logger/getLogContent.js";
import type { UsersService } from "./users.service.js";

type IdParam = {
    id: string;
}

export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    index = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const users = await this.usersService.list();

            res.status(200).json(users);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "users_index",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao buscar usuarios.",
                error: message,
            });
        }
    }

    show = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {

            const store = await this.usersService.findById(
                req.params.id
            );

            if (!store) {
                res.status(404).json({
                    message: "Usuario não encontrada"
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
                route: "users_show",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao buscar usuario.",
                error: message,
            });
        }
    }

    store = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const store = await this.usersService.create(
                req.body
            );

            res.status(201).json(store);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "users_create",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao criar usuario.",
                error: message,
            });
        }
    }

    update = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            const store = await this.usersService.update(
                req.params.id,
                req.body
            );

            if (!store) {
                res.status(404).json({
                    message: "Usuario não encontrada"
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
                route: "users_update",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao atualizar dados do usuario.",
                error: message,
            });
        }
    }

    destroy = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            await this.usersService.delete(
                req.params.id
            );

            res.sendStatus(204);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "users_delete",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao excluir o usuario.",
                error: message,
            });
        }
    }
}