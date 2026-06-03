import groupRoutes from "../../../../utils/http/groupRoutes.js";
import { CompaniesRepository } from "./companies.repository.js";
import { CompaniesService } from "./companies.service.js";
import { CompaniesController } from "./companies.controller.js";
import { companiesValidator } from "./companies.validator.js";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware.js";

const repository = new CompaniesRepository();
const service = new CompaniesService(repository);
const controller = new CompaniesController(service);

export default async function CompaniesRoutes() {
    groupRoutes('/companies', (companies) => {
        companies.use(AuthMiddleware);

        companies.get('/', controller.index);
        companies.post('/',
            companiesValidator.store,
            controller.store
        );
        companies.get('/:id',
            companiesValidator.show,
            controller.show
        );
        companies.put('/:id',
            companiesValidator.update,
            controller.update
        );
        companies.delete('/:id',
            companiesValidator.destroy,
            controller.destroy
        );
    });
}
