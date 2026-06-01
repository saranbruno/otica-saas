import type { Request, Response } from "express";
import type { CompaniesService } from "./companies.service.js";
import { RequestErrorLog } from "../../../../utils/logger/requestError.js";
import getLogContent from "../../../../utils/logger/getLogContent.js";

type IdParam = {
    id: string;
}

export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService
    ) { }

    index = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const companies = await this.companiesService.list();

            res.status(200).json(companies);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "companies_index",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao buscar empresas.",
                error: message,
            });
        }
    }

    show = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {

            const company = await this.companiesService.findById(
                req.params.id
            );

            if (!company) {
                res.status(404).json({
                    message: "Empresa não encontrada"
                });

                return;
            }

            res.status(200).json(company);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "companies_show",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao buscar empresa.",
                error: message,
            });
        }
    }

    store = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const company = await this.companiesService.create(
                req.body
            );

            res.status(201).json(company);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "companies_create",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao criar empresa.",
                error: message,
            });
        }
    }

    update = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            const company = await this.companiesService.update(
                req.params.id,
                req.body
            );

            if (!company) {
                res.status(404).json({
                    message: "Empresa não encontrada"
                });

                return;
            }

            res.status(200).json(company);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "companies_update",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao atualizar dados da empresa.",
                error: message,
            });
        }
    }

    destroy = async (
        req: Request<IdParam>,
        res: Response
    ): Promise<void> => {
        try {
            await this.companiesService.delete(
                req.params.id
            );

            res.sendStatus(204);
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "companies_delete",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao excluir a empresa.",
                error: message,
            });
        }
    }
}