import groupRoutes from "../../../../utils/http/groupRoutes.js";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware.js";
import { UsersController } from "./users.controller.js";
import { UsersRepository } from "./users.repository.js";
import { UsersService } from "./users.service.js";
import { usersValidator } from "./users.vallidator.js";

const repository = new UsersRepository();
const service = new UsersService(repository);
const controller = new UsersController(service);

export default async function UsersRoutes() {
    groupRoutes('/users', (users) => {
        users.use(AuthMiddleware),

        users.get('/',
            controller.index
        );
        users.post('/',
            usersValidator.store,
            controller.store
        );
        users.get('/:id',
            usersValidator.show,
            controller.show
        );
        users.put('/:id',
            usersValidator.update,
            controller.update
        );
        users.delete('/:id',
            usersValidator.destroy,
            controller.destroy
        );
    });
}
