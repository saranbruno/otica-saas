import { body, param } from "express-validator";
import vallidateRequest from "../../../../utils/http/vallidateRequest.js";


export const companiesValidator = {
    show: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),
    ]),

    store: vallidateRequest([
        body('name')
            .notEmpty()
            .isString()
            .isLength({ min: 4, max: 60 }),

        body("email")
            .notEmpty()
            .isEmail(),

        body("profile_image")
            .optional()
            .isString(),

        body("country")
            .notEmpty()
            .isString()
            .isLength({ min: 2, max: 2 }),

        body("timezone")
            .notEmpty()
            .isString(),

        body("active")
            .optional()
            .isBoolean(),
    ]),

    update: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),

        body('name')
            .optional()
            .isString()
            .isLength({ min: 4, max: 60 }),

        body("email")
            .optional()
            .isEmail(),

        body("profile_image")
            .optional()
            .isString(),

        body("country")
            .optional()
            .isString()
            .isLength({ min: 2, max: 2 }),

        body("timezone")
            .optional()
            .isString(),

        body("active")
            .optional()
            .isBoolean(),
    ]),

    destroy: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),
    ]),
};