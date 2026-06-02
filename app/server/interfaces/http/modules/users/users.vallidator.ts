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
    ]),

    destroy: vallidateRequest([
        param("id")
            .isUUID(7)
            .withMessage("ID inválido"),
    ]),
}