import { body, param } from "express-validator";
import vallidateRequest from "../../../../utils/http/vallidateRequest.js";


export const usersValidator = {
    show: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),
    ]),

    store: vallidateRequest([
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

    update: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),

        body('name')
            .optional()
            .isString()
            .isLength({ min: 4, max: 120 }),

        body("email")
            .optional()
            .isEmail(),

        body("phone")
            .optional()
            .isString()
            .isLength({ min: 7, max: 15 }),

        body("profile_image")
            .optional()
            .isString(),

        body("password")
            .optional()
            .isString()
            .isLength({ min: 6, max: 30 })
            .matches(/[A-Z]/)
            .withMessage("A senha deve conter pelo menos uma letra maiúscula")
            .matches(/[0-9]/)
            .withMessage("A senha deve conter pelo menos um número")
    ]),

    destroy: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),
    ]),
}