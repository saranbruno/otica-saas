import type { StoresRepository } from "./stores.repository.js";


export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository
    ) { }

    async list() {
        return this.storesRepository.getAll();
    }

    async findById(id: string) {
        return this.storesRepository.findById(id);
    }

    async create(data: CreateStoreDTO) {
        const StoreCount = await this.storesRepository.countByCompanyId(data.company_id)

        const finalData: CreateStoreDTO = {
            ...data,
            public_id: (StoreCount + 1).toString(),
        }

        return this.storesRepository.create(finalData);
    }

    async update(
        id: string,
        data: UpdateStoreDTO
    ) {
        return this.storesRepository.update(id, data);
    }

    async delete(id: string) {
        return this.storesRepository.delete(id);
    }
}