import type { Migration } from "../../types/migrate.js";

export const migration: Migration = {
    name: "create_users",

    async up(query) {
        await query(`
            CREATE TABLE users (
              id UUID PRIMARY KEY DEFAULT uuidv7(),
              public_id VARCHAR(50) NOT NULL UNIQUE,

              active_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
              active_store_id UUID REFERENCES stores(id) ON DELETE SET NULL,

              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE,
              phone VARCHAR(30),
              profile_image TEXT,

              remember_token TEXT,

              created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
              deleted_at TIMESTAMPTZ
            );

            CREATE INDEX idx_users_email ON users(email);
            CREATE INDEX idx_users_active_company_id ON users(active_company_id);
            CREATE INDEX idx_users_active_store_id ON users(active_store_id);
            CREATE INDEX idx_users_deleted_at ON users(deleted_at);
        `);
    },

    async down(query) {
        await query(`
            DROP TABLE IF EXISTS users;
        `);
    }
};