import type { UserStoreAccessRepository } from "./user_store_access.repository.js";

export class UserStoreAccessService {
    constructor(
        private readonly userStoreAccessRepository: UserStoreAccessRepository
    ) { }

    async list(companyId: string | null | undefined) {
        const safeCompanyId = this.getCompanyId(companyId);

        return this.userStoreAccessRepository.getAll(safeCompanyId);
    }

    async findById(
        id: string,
        companyId: string | null | undefined
    ) {
        const safeCompanyId = this.getCompanyId(companyId);
        const accessId = this.getAccessId(id);

        return this.userStoreAccessRepository.findById(
            accessId,
            safeCompanyId
        );
    }

    async listStoresByUserId(
        userId: string,
        companyId: string | null | undefined
    ) {
        const safeCompanyId = this.getCompanyId(companyId);

        await this.ensureUserExists(userId, safeCompanyId);

        return this.userStoreAccessRepository.listStoresByUserId(
            userId,
            safeCompanyId
        );
    }

    async listUsersByStoreId(
        storeId: string,
        companyId: string | null | undefined
    ) {
        const safeCompanyId = this.getCompanyId(companyId);

        await this.ensureStoreExists(storeId, safeCompanyId);

        return this.userStoreAccessRepository.listUsersByStoreId(
            storeId,
            safeCompanyId
        );
    }

    async create(
        data: CreateUserStoreAccessDTO,
        companyId: string | null | undefined
    ) {
        const safeCompanyId = this.getCompanyId(companyId);

        await this.ensureUserExists(data.user_id, safeCompanyId);
        await this.ensureStoreExists(data.store_id, safeCompanyId);

        const existingAccess = await this.userStoreAccessRepository.findByUserAndStore(
            data.user_id,
            data.store_id
        );

        if (existingAccess) {
            throw new Error("access_already_exists");
        }

        return this.userStoreAccessRepository.create(data);
    }

    async delete(
        id: string,
        companyId: string | null | undefined
    ) {
        const safeCompanyId = this.getCompanyId(companyId);
        const accessId = this.getAccessId(id);

        const access = await this.userStoreAccessRepository.findById(
            accessId,
            safeCompanyId
        );

        if (!access) {
            throw new Error("access_not_found");
        }

        return this.userStoreAccessRepository.delete(accessId);
    }

    private getCompanyId(companyId: string | null | undefined): string {
        if (!companyId) {
            throw new Error("company_required");
        }

        return companyId;
    }

    private getAccessId(id: string): number {
        const accessId = Number(id);

        if (!Number.isInteger(accessId) || accessId < 1) {
            throw new Error("invalid_access_id");
        }

        return accessId;
    }

    private async ensureUserExists(
        userId: string,
        companyId: string
    ): Promise<UserType> {
        const user = await this.userStoreAccessRepository.findUserById(
            userId,
            companyId
        );

        if (!user) {
            throw new Error("user_not_found");
        }

        return user;
    }

    private async ensureStoreExists(
        storeId: string,
        companyId: string
    ): Promise<StoreType> {
        const store = await this.userStoreAccessRepository.findStoreById(
            storeId,
            companyId
        );

        if (!store) {
            throw new Error("store_not_found");
        }

        return store;
    }
}
