import groupRoutes from "../../../../utils/http/groupRoutes.js";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware.js";
import { UserStoreAccessController } from "./user_store_access.controller.js";
import { UserStoreAccessRepository } from "./user_store_access.repository.js";
import { UserStoreAccessService } from "./user_store_access.service.js";
import { userStoreAccessValidator } from "./user_store_access.validator.js";

const repository = new UserStoreAccessRepository();
const service = new UserStoreAccessService(repository);
const controller = new UserStoreAccessController(service);

export default async function UserStoreAccessRoutes() {
    groupRoutes('/acess', (access) => {
        access.use(AuthMiddleware);

        access.get('/',
            controller.index
        );
        access.post('/',
            userStoreAccessValidator.store,
            controller.store
        );
        access.get('/users/:user_id/stores',
            userStoreAccessValidator.listStoresByUser,
            controller.listStoresByUser
        );
        access.get('/stores/:store_id/users',
            userStoreAccessValidator.listUsersByStore,
            controller.listUsersByStore
        );
        access.get('/:id',
            userStoreAccessValidator.show,
            controller.show
        );
        access.delete('/:id',
            userStoreAccessValidator.destroy,
            controller.destroy
        );
    });
}
