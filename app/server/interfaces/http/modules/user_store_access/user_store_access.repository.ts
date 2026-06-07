import { fetchFirst, query } from "../../../../providers/psql.js";

export class UserStoreAccessRepository {
    async getAll(companyId: string): Promise<UserStoreAccessWithRelationsType[]> {
        return await query<UserStoreAccessWithRelationsType>(`
            SELECT
                user_store_access.id,
                user_store_access.user_id,
                user_store_access.store_id,
                user_store_access.created_at,
                users.public_id AS user_public_id,
                users.name AS user_name,
                users.email AS user_email,
                stores.public_id AS store_public_id,
                stores.name AS store_name
            FROM user_store_access
            INNER JOIN users ON users.id = user_store_access.user_id
            INNER JOIN stores ON stores.id = user_store_access.store_id
            WHERE users.company_id = $1
            AND stores.company_id = $1
            AND users.deleted_at IS NULL
            AND stores.deleted_at IS NULL
            ORDER BY user_store_access.created_at DESC
            `,
            [companyId]
        );
    }

    async findById(
        id: number,
        companyId: string
    ): Promise<UserStoreAccessWithRelationsType | null> {
        return await fetchFirst<UserStoreAccessWithRelationsType>(`
            SELECT
                user_store_access.id,
                user_store_access.user_id,
                user_store_access.store_id,
                user_store_access.created_at,
                users.public_id AS user_public_id,
                users.name AS user_name,
                users.email AS user_email,
                stores.public_id AS store_public_id,
                stores.name AS store_name
            FROM user_store_access
            INNER JOIN users ON users.id = user_store_access.user_id
            INNER JOIN stores ON stores.id = user_store_access.store_id
            WHERE user_store_access.id = $1
            AND users.company_id = $2
            AND stores.company_id = $2
            AND users.deleted_at IS NULL
            AND stores.deleted_at IS NULL
            LIMIT 1
            `,
            [
                id,
                companyId,
            ]
        );
    }

    async findByUserAndStore(
        userId: string,
        storeId: string
    ): Promise<UserStoreAccessType | null> {
        return await fetchFirst<UserStoreAccessType>(`
            SELECT *
            FROM user_store_access
            WHERE user_id = $1
            AND store_id = $2
            LIMIT 1
            `,
            [
                userId,
                storeId,
            ]
        );
    }

    async findUserById(
        userId: string,
        companyId: string
    ): Promise<UserType | null> {
        return await fetchFirst<UserType>(`
            SELECT *
            FROM users
            WHERE id = $1
            AND company_id = $2
            AND deleted_at IS NULL
            LIMIT 1
            `,
            [
                userId,
                companyId,
            ]
        );
    }

    async findStoreById(
        storeId: string,
        companyId: string
    ): Promise<StoreType | null> {
        return await fetchFirst<StoreType>(`
            SELECT *
            FROM stores
            WHERE id = $1
            AND company_id = $2
            AND deleted_at IS NULL
            LIMIT 1
            `,
            [
                storeId,
                companyId,
            ]
        );
    }

    async listStoresByUserId(
        userId: string,
        companyId: string
    ): Promise<StoreType[]> {
        return await query<StoreType>(`
            SELECT stores.*
            FROM stores
            INNER JOIN user_store_access
                ON user_store_access.store_id = stores.id
            WHERE user_store_access.user_id = $1
            AND stores.company_id = $2
            AND stores.deleted_at IS NULL
            ORDER BY stores.name ASC
            `,
            [
                userId,
                companyId,
            ]
        );
    }

    async listUsersByStoreId(
        storeId: string,
        companyId: string
    ): Promise<UserType[]> {
        return await query<UserType>(`
            SELECT users.*
            FROM users
            INNER JOIN user_store_access
                ON user_store_access.user_id = users.id
            WHERE user_store_access.store_id = $1
            AND users.company_id = $2
            AND users.deleted_at IS NULL
            ORDER BY users.name ASC
            `,
            [
                storeId,
                companyId,
            ]
        );
    }

    async create(
        data: CreateUserStoreAccessDTO
    ): Promise<UserStoreAccessType | null> {
        const [created] = await query<UserStoreAccessType>(
            `
            INSERT INTO user_store_access (
                user_id,
                store_id
            )
            VALUES ($1, $2)
            ON CONFLICT (user_id, store_id) DO NOTHING
            RETURNING *
            `,
            [
                data.user_id,
                data.store_id,
            ]
        );

        return created ?? this.findByUserAndStore(data.user_id, data.store_id);
    }

    async delete(id: number): Promise<void> {
        await query(`
            DELETE FROM user_store_access
            WHERE id = $1
            `,
            [id]
        );
    }
}
