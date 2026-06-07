import groupRoutes from "../../../../utils/http/groupRoutes.js";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware.js";
import { CompaniesRepository } from "../companies/companies.repository.js";
import { UsersRepository } from "../users/users.repository.js";
import { UsersService } from "../users/users.service.js";
import { AuthenticationController } from "./authentication.controller.js";
import { AuthenticationRepository } from "./authentication.repository.js";
import { AuthenticationService } from "./authentication.service.js";
import { authenticationVallidator } from "./authentication.vallidator.js";

const repository = new AuthenticationRepository();
const userRepository = new UsersRepository();
const companiesRepository = new CompaniesRepository();
const service = new AuthenticationService(repository);
const userService = new UsersService(userRepository, companiesRepository);
const controller = new AuthenticationController(service, userService);

export default async function AuthenticationRoutes() {
    groupRoutes('/auth', (users) => {
        users.post('/login',
            authenticationVallidator.login,
            controller.login
        );
        users.post('/register',
            authenticationVallidator.register,
            controller.register
        );
        users.post('/refresh',
            authenticationVallidator.refresh,
            controller.refresh
        );
        users.post('/logout',
            authenticationVallidator.logout,
            AuthMiddleware,
            controller.logout
        );
        users.get('/me',
            AuthMiddleware,
            controller.showMe
        );
    });
}
