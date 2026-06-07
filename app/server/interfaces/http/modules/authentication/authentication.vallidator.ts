import { body } from "express-validator";
import vallidateRequest from "../../../../utils/http/vallidateRequest.js";


export const authenticationVallidator = {
    login: vallidateRequest([
        body("email")
            .notEmpty()
            .isEmail(),

        body("password")
            .notEmpty()
            .isString(),
    ]),

    refresh: vallidateRequest([
        body("refresh_token")
            .notEmpty()
            .isString(),
    ]),

    logout: vallidateRequest([
        body("refresh_token")
            .notEmpty()
            .isString(),
    ]),

    register: vallidateRequest([
        body("company_id")
            .isUUID(7)
            .withMessage("ID inválido"),

        body('name')
            .notEmpty()
            .isString()
            .isLength({ min: 4, max: 120 }),

        body("email")
            .notEmpty()
            .isEmail(),

        body("phone")
            .notEmpty()
            .isString()
            .isLength({ min: 7, max: 15 }),

        body("profile_image")
            .optional()
            .isString(),

        body("password")
            .notEmpty()
            .isString()
            .isLength({ min: 6, max: 30 })
            .matches(/[A-Z]/)
            .withMessage("A senha deve conter pelo menos uma letra maiúscula")
            .matches(/[0-9]/)
            .withMessage("A senha deve conter pelo menos um número"),
    ]),
}
