import { body, param } from "express-validator";
import vallidateRequest from "../../../../utils/http/vallidateRequest.js";


export const storesValidator = {
    show: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),
    ]),

    store: vallidateRequest([
        body("company_id")
            .isUUID(7)
            .withMessage("ID inválido"),

        body('name')
            .notEmpty()
            .isString()
            .isLength({ min: 4, max: 60 }),

        body("profile_image")
            .optional()
            .isString(),

        body("zip_code")
            .optional()
            .isString()
            .isLength({ min: 4, max: 10 }),

        body("street")
            .optional()
            .isString(),

        body("number")
            .optional()
            .isString()
            .isLength({ min: 1, max: 20 }),

        body("district")
            .optional()
            .isString()
            .isLength({ min: 1, max: 50 }),

        body("city")
            .optional()
            .isString()
            .isLength({ min: 1, max: 50 }),

        body("state")
            .optional()
            .isString()
            .isLength({ min: 1, max: 50 }),

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

        body("profile_image")
            .optional()
            .isString(),

        body("zip_code")
            .optional()
            .isString()
            .isLength({ min: 4, max: 10 }),

        body("street")
            .optional()
            .isString(),

        body("number")
            .optional()
            .isString()
            .isLength({ min: 1, max: 20 }),

        body("district")
            .optional()
            .isString()
            .isLength({ min: 1, max: 50 }),

        body("city")
            .optional()
            .isString()
            .isLength({ min: 1, max: 50 }),

        body("state")
            .optional()
            .isString()
            .isLength({ min: 1, max: 50 }),

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