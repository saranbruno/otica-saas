import { fetchFirst, getUpdateKeysValues, query, transaction } from "../../../../providers/psql.js";

export class StoresRepository {
    async getAll(): Promise<StoreType[]> {
        return await query<StoreType>(`
            SELECT *
            FROM stores
            WHERE deleted_at IS NULL
            `,
        )
    }

    async findById(id: string): Promise<StoreType | null> {
        return await fetchFirst<StoreType>(`
            SELECT *
            FROM stores
            WHERE id = $1
            AND deleted_at IS NULL
            LIMIT 1
            `,
            [id]
        )
    }

    async create(
        data: CreateStoreDTO
    ): Promise<StoreType | null> {
        const columns = Object.keys(data);
        const values = Object.values(data);

        const placeholders = values.map((_, i) => `$${i + 1}`);

        const [created] = await query<StoreType>(
            `
        INSERT INTO stores (${columns.join(", ")})
        VALUES (${placeholders.join(", ")})
        RETURNING *;
        `,
            values
        );

        return created ?? null;
    }

    async update(
        id: string,
        data: UpdateStoreDTO
    ): Promise<StoreType | null> {
        const entries = Object.entries(data);

        if (!entries.length) {
            return this.findById(id);
        }

        const {
            fields,
            values,
        } = getUpdateKeysValues(entries);

        const [user] = await query<StoreType>(
            `
            UPDATE stores
            SET
                ${fields.join(", ")},
                updated_at = timezone('utc', now())
            WHERE id = $${values.length + 1}
            RETURNING *
            `,
            [...values, id]
        );

        return user ?? null;
    }

    async delete(id: string) {
        await query(`
                UPDATE stores
                SET
                    deleted_at = timezone('utc', now())
                WHERE id = $1
            `,
            [id]
        );
    }

    async countByCompanyId(companyId: string): Promise<number> {
        return await fetchFirst<number>(`
            SELECT COUNT(id)
            FROM stores
            WHERE company_id = $1
            `, [companyId]
        ) ?? 0;
    }
}