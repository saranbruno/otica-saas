import { body, param } from "express-validator";
import vallidateRequest from "../../../../utils/http/vallidateRequest.js";

export const userStoreAccessValidator = {
    show: vallidateRequest([
        param("id")
            .isInt({ min: 1 })
            .withMessage("ID inválido"),
    ]),

    store: vallidateRequest([
        body("user_id")
            .isUUID(7)
            .withMessage("ID de usuário inválido"),

        body("store_id")
            .isUUID(7)
            .withMessage("ID de loja inválido"),
    ]),

    listStoresByUser: vallidateRequest([
        param("user_id")
            .isUUID(7)
            .withMessage("ID de usuário inválido"),
    ]),

    listUsersByStore: vallidateRequest([
        param("store_id")
            .isUUID(7)
            .withMessage("ID de loja inválido"),
    ]),

    destroy: vallidateRequest([
        param("id")
            .isInt({ min: 1 })
            .withMessage("ID inválido"),
    ]),
};
