import type { Request, Response } from "express";
import { RequestErrorLog } from "../../../../utils/logger/requestError.js";
import getLogContent from "../../../../utils/logger/getLogContent.js";
import type { UserStoreAccessService } from "./user_store_access.service.js";

type IdParam = {
    id: string;
}

type UserIdParam = {
    user_id: string;
}

type StoreIdParam = {
    store_id: string;
}

type KnownUserStoreAccessError = {
    status: number;
    message: string;
}

function getKnownError(message: string): KnownUserStoreAccessError | null {
    const errors: Record<string, KnownUserStoreAccessError> = {
        company_required: {
            status: 403,
            message: "Empresa ativa não identificada.",
        },
        invalid_access_id: {
            status: 422,
            message: "ID inválido.",
        },
        user_not_found: {
            status: 404,
            message: "Usuário não encontrado para esta empresa.",
        },
        store_not_found: {
            status: 404,
            message: "Loja não encontrada para esta empresa.",
        },
        access_not_found: {
            status: 404,
            message: "Acesso não encontrado.",
        },
        access_already_exists: {
            status: 409,
            message: "Usuário já possui acesso a esta loja.",
        },
    };

    return errors[message] ?? null;
}

export class UserStoreAccessController {
    constructor(
        private readonly userStoreAccessService: UserStoreAccessService
    ) { }

    index = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const accesses = await this.userStoreAccessService.list(
                req.user?.company_id
            );

            res.status(200).json(accesses);
        } catch (error) {
            this.handleError(
                error,
                req,
                res,
                "user_store_access_index",
                "Ocorreu um erro inesperado ao buscar acessos."
            );
        }
    }

    show = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            const access = await this.userStoreAccessService.findById(
                req.params.id,
                req.user?.company_id
            );

            if (!access) {
                res.status(404).json({
                    message: "Acesso não encontrado."
                });

                return;
            }

            res.status(200).json(access);
        } catch (error) {
            this.handleError(
                error,
                req,
                res,
                "user_store_access_show",
                "Ocorreu um erro inesperado ao buscar acesso."
            );
        }
    }

    listStoresByUser = async (
        req: Request<UserIdParam>,
        res: Response
    ): Promise<void> => {
        try {
            const stores = await this.userStoreAccessService.listStoresByUserId(
                req.params.user_id,
                req.user?.company_id
            );

            res.status(200).json(stores);
        } catch (error) {
            this.handleError(
                error,
                req,
                res,
                "user_store_access_list_stores_by_user",
                "Ocorreu um erro inesperado ao buscar lojas do usuário."
            );
        }
    }

    listUsersByStore = async (
        req: Request<StoreIdParam>,
        res: Response
    ): Promise<void> => {
        try {
            const users = await this.userStoreAccessService.listUsersByStoreId(
                req.params.store_id,
                req.user?.company_id
            );

            res.status(200).json(users);
        } catch (error) {
            this.handleError(
                error,
                req,
                res,
                "user_store_access_list_users_by_store",
                "Ocorreu um erro inesperado ao buscar usuários da loja."
            );
        }
    }

    store = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const access = await this.userStoreAccessService.create(
                req.body,
                req.user?.company_id
            );

            res.status(201).json(access);
        } catch (error) {
            this.handleError(
                error,
                req,
                res,
                "user_store_access_create",
                "Ocorreu um erro inesperado ao criar acesso."
            );
        }
    }

    destroy = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            await this.userStoreAccessService.delete(
                req.params.id,
                req.user?.company_id
            );

            res.sendStatus(204);
        } catch (error) {
            this.handleError(
                error,
                req,
                res,
                "user_store_access_delete",
                "Ocorreu um erro inesperado ao remover acesso."
            );
        }
    }

    private handleError(
        error: unknown,
        req: Request,
        res: Response,
        route: string,
        fallbackMessage: string
    ): void {
        const {
            code,
            message,
        } = getLogContent(error);

        const knownError = getKnownError(message);

        if (knownError) {
            res.status(knownError.status).json({
                result: false,
                message: knownError.message,
            });

            return;
        }

        RequestErrorLog({
            route,
            code,
            message,
            payload: {
                body: req.body,
                param: req.params,
            }
        });

        res.status(500).json({
            result: false,
            message: fallbackMessage,
            error: message,
        });
    }
}
