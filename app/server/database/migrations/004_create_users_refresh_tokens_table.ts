import type { Migration } from "../../types/migrate.js";

export const migration: Migration = {
    name: "create_users_refresh_tokens",

    async up(query) {
        await query(`
            CREATE TABLE user_refresh_tokens (
                id UUID PRIMARY KEY DEFAULT uuidv7(),

                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

                token TEXT NOT NULL UNIQUE,

                expires_at TIMESTAMPTZ NOT NULL,

                created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
            );

            CREATE INDEX idx_user_refresh_tokens_user_id
            ON user_refresh_tokens(user_id);

            CREATE INDEX idx_user_refresh_tokens_expires_at
            ON user_refresh_tokens(expires_at);
        `);
    },

    async down(query) {
        await query(`
            DROP TABLE IF EXISTS user_refresh_tokens;
        `);
    }
};