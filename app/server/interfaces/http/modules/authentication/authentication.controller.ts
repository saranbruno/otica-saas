import type { Request, Response } from "express";
import { RequestErrorLog } from "../../../../utils/logger/requestError.js";
import getLogContent from "../../../../utils/logger/getLogContent.js";
import type { AuthenticationService } from "./authentication.service.js";
import type { UsersService } from "../users/users.service.js";
import jwt from 'jsonwebtoken';
import { v7 } from "uuid";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly userService: UsersService,
    ) { }

    register = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const {
                user,
                refreshToken
            } = await this.authService.registerUserAndGenerateToken(req.body);

            if (!user) throw new Error("error_register_user");

            const accessToken = jwt.sign(
                {
                    sub: user.id,
                    company_id: null,
                    store_id: null,
                },
                JWT_SECRET,
                {
                    expiresIn: "15m"
                }
            );

            res.status(200).json({
                result: true,
                message: "Cadastro realizado com sucesso.",
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: {
                        id: user.id,
                        public_id: user.public_id,
                        name: user.name,
                        email: user.email,
                        profile_image: user.profile_image,
                    },
                },
            });
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "authentication_register",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao realizar cadastro.",
                error: message,
            });
        }
    }

    login = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const body = req.body;

            const user = await this.userService.findByEmail(body.email);

            if (!user) {
                res.status(401).json({
                    result: false,
                    message: "Email ou senha inválidos.",
                });
                return;
            }

            const isPasswordValid = await bcrypt.compare(
                body.password,
                user.password
            );

            if (!isPasswordValid) {
                res.status(401).json({
                    result: false,
                    message: "Email ou senha inválidos.",
                });
                return;
            }

            const accessToken = jwt.sign(
                {
                    sub: user.id,
                    company_id: null,
                    store_id: null,
                },
                JWT_SECRET,
                {
                    expiresIn: "15m"
                }
            );

            const refreshToken = v7();

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            await this.authService.create({
                user_id: user.id,
                token: refreshToken,
                expires_at: expiresAt
            });

            res.status(200).json({
                result: true,
                message: "Login realizado com sucesso.",
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: {
                        id: user.id,
                        public_id: user.public_id,
                        name: user.name,
                        email: user.email,
                        profile_image: user.profile_image,
                    },
                },
            });
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "authentication_login",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao realizar login.",
                error: message,
            });
        }
    }

    refresh = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const body = req.body;

            const dbToken = await this.authService.findByToken(body.refresh_token);

            if (!dbToken) {
                res.status(401).json({
                    result: false,
                    message: "Token inválido.",
                });
                return;
            }

            if (new Date(dbToken.expires_at) < new Date()) {
                res.status(401).json({
                    result: false,
                    message: "Token expirado.",
                });
                return;
            }

            const accessToken = jwt.sign(
                {
                    sub: dbToken.user_id,
                    company_id: null,
                    store_id: null,
                },
                JWT_SECRET,
                {
                    expiresIn: "15m"
                }
            );

            res.status(200).json({
                result: true,
                message: "Token recarregado com sucesso.",
                data: {
                    access_token: accessToken,
                    refresh_token: dbToken.token,
                },
            });
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "authentication_refresh",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao recarregar token.",
                error: message,
            });
        }
    }

    logout = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const body = req.body;

            await this.authService.delete(body.refresh_token);

            res.status(200).json({
                result: true,
                message: "Logout realizado com sucesso."
            });
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "authentication_logout",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao desconectar.",
                error: message,
            });
        }
    }

    showMe = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const user = req.user;

            if (!user) {
                res.status(401).json({
                    result: false,
                    message: "Usuário não autenticado.",
                });
                return;
            }

            const dbUser = await this.userService.findById(user.id);

            if (!dbUser) {
                res.status(404).json({
                    result: false,
                    message: "Usuário não encontrado.",
                });
                return;
            }

            res.status(200).json({
                "result": true,
                "me": {
                    "user": {
                        id: dbUser?.public_id,
                        name: dbUser?.name,
                        email: dbUser?.email,
                        phone: dbUser?.phone,
                        profile_image: dbUser?.profile_image,
                    } as UserType,
                    "active_company": {},
                    "active_store": {},
                    "companies": [],
                    "stores": []
                }
            });
        } catch (error) {
            const {
                code,
                message,
            } = getLogContent(error);

            RequestErrorLog({
                route: "authentication_show_me",
                code: code,
                message: message,
                payload: {
                    body: req.body,
                    param: req.params,
                }
            });

            res.status(500).json({
                result: false,
                message: "Ocorreu um erro inesperado ao pegar dados do usuario.",
                error: message,
            });
        }
    }
}