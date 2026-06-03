import type { Request, Response, NextFunction } from "express";

export async function ActiveCompanieMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const user = req.user;

    if (!user?.store_id) {
        res.status(401).json({
            message: "Loja inválida"
        });
        return;
    }

    next();
}