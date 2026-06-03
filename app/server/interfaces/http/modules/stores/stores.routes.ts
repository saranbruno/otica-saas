import groupRoutes from "../../../../utils/http/groupRoutes.js";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware.js";
import { StoresController } from "./stores.controller.js";
import { StoresRepository } from "./stores.repository.js";
import { StoresService } from "./stores.service.js";
import { storesValidator } from "./stores.validator.js";

const repository = new StoresRepository();
const service = new StoresService(repository);
const controller = new StoresController(service);

export default async function StoresRoutes() {
    groupRoutes('/stores', (stores) => {
        stores.use(AuthMiddleware);

        stores.get('/', controller.index);
        stores.post('/',
            storesValidator.store,
            controller.store
        );
        stores.get('/:id',
            storesValidator.show,
            controller.show
        );
        stores.put('/:id',
            storesValidator.update,
            controller.update
        );
        stores.delete('/:id',
            storesValidator.destroy,
            controller.destroy
        );
    });
}
