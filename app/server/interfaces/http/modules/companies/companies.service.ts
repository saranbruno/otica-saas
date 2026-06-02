import { CompaniesRepository } from "./companies.repository.js";

export class CompaniesService {
    constructor(
        private readonly companiesRepository: CompaniesRepository
    ) { }

    async list() {
        return this.companiesRepository.getAll();
    }

    async findById(id: string) {
        return this.companiesRepository.findById(id);
    }

    async create(data: UpdateCompanyDTO) {
        if (data.email) {
            const companyWithEmail = await this.companiesRepository.findByEmail(data.email);

            if (companyWithEmail) throw new Error("email_already_exists");
        }

        return this.companiesRepository.create(data);
    }

    async update(
        id: string,
        data: UpdateCompanyDTO
    ) {
        if (data.email) {
            const companyWithEmail =
                await this.companiesRepository.findByEmail(
                    data.email
                );

            if (
                companyWithEmail &&
                companyWithEmail.id !== id
            ) {
                throw new Error("email_already_exists");
            }
        }

        return this.companiesRepository.update(id, data);
    }

    async delete(id: string) {
        return this.companiesRepository.delete(id);
    }
}