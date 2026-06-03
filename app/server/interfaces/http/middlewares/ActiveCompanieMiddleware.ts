import type { Request, Response, NextFunction } from "express";

export async function ActiveCompanieMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const user = req.user;
    
    if (!user?.company_id) {
        res.status(401).json({
            message: "Empresa inválida"
        });
        return;
    }

    next();
}