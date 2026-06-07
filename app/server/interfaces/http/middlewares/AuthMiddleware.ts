import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function AuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            message: "Token não informado"
        });
        return;
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
        res.status(401).json({
            message: "Token inválido"
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        req.user = {
            id: decoded.sub,
            company_id: decoded.company_id ?? null,
            store_id: decoded.store_id ?? null,
        };

        next();
    } catch {
        res.status(401).json({
            message: "Token inválido ou expirado"
        });
    }
}
