import { fetchFirst, getUpdateKeysValues, query, transaction } from "../../../../providers/psql.js";

export class AuthenticationRepository {
    async create(data: CreateUserRefreshTokenDTO) {
        const columns = Object.keys(data);
        const values = Object.values(data);

        const placeholders = values.map((_, i) => `$${i + 1}`);

        const created = await fetchFirst<UserRefreshTokenType>(`
            INSERT INTO user_refresh_tokens (${columns.join(", ")})
            VALUES (${placeholders.join(", ")})
            RETURNING *;
            `,
            values
        )

        return created ?? null;
    }

    async findRefreshToken(token: string): Promise<UserRefreshTokenType | null> {
        return await fetchFirst<UserRefreshTokenType>(`
            SELECT *
            FROM user_refresh_tokens
            WHERE token = $1
            LIMIT 1
            `,
            [token]
        )
    }

    async findRefreshTokenByUserId(id: string): Promise<UserRefreshTokenType | null> {
        return await fetchFirst<UserRefreshTokenType>(`
            SELECT *
            FROM user_refresh_tokens
            WHERE user_id = $1
            LIMIT 1
            `,
            [id]
        )
    }

    async deleteToken(token: string) {
        return await query(`
            DELETE FROM user_refresh_tokens
            WHERE token = $1
            `,
            [token]
        );
    }

    async deleteExpiredTokens() {
        return await query(`
            DELETE
            FROM user_refresh_tokens
            WHERE expires_at < now();
            `
        );
    }
}