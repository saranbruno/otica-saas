import type { Request, Response, NextFunction } from "express";
import { validationResult, type ValidationChain } from "express-validator";

export default function vallidateRequest(validator: ValidationChain[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
        await Promise.all(validator.map((validation) => validation.run(req)));

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array(),
            });
        }

        next();
    };
}
