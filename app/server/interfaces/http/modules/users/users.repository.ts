import { fetchFirst, getUpdateKeysValues, query, transaction } from "../../../../providers/psql.js";

export class UsersRepository {
    async getAll(): Promise<UserType[]> {
        return await query<UserType>(`
            SELECT *
            FROM users
            WHERE deleted_at IS NULL
            `,
        )
    }

    async findById(id: string): Promise<UserType | null> {
        return await fetchFirst<UserType>(`
            SELECT *
            FROM users
            WHERE id = $1
            AND deleted_at IS NULL
            LIMIT 1
            `,
            [id]
        )
    }

    async findByEmail(email: string): Promise<UserType | null> {
        return await fetchFirst<UserType>(`
            SELECT *
            FROM users
            WHERE email = $1
            AND deleted_at IS NULL
            LIMIT 1
            `,
            [email]
        )
    }

    async create(
        data: CreateUserDTO
    ): Promise<UserType | null> {
        const columns = Object.keys(data);
        const values = Object.values(data);

        const placeholders = values.map((_, i) => `$${i + 1}`);

        const [created] = await query<UserType>(
            `
        INSERT INTO users (${columns.join(", ")})
        VALUES (${placeholders.join(", ")})
        RETURNING *;
        `,
            values
        );

        return created ?? null;
    }

    async update(
        id: string,
        data: UpdateUserDTO
    ): Promise<UserType | null> {
        const entries = Object.entries(data);

        if (!entries.length) {
            return this.findById(id);
        }

        const {
            fields,
            values,
        } = getUpdateKeysValues(entries);

        const [user] = await query<UserType>(
            `
            UPDATE users
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
                UPDATE users
                SET
                    deleted_at = timezone('utc', now())
                WHERE id = $1
            `,
            [id]
        )
    }
}