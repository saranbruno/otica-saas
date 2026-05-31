import type { Migration } from "../../types/migrate.js";

export const migration: Migration = {
  name: "create_companies",

  async up(query) {
    await query(`
            CREATE TABLE companies (
              id UUID PRIMARY KEY DEFAULT uuidv7(),

              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL UNIQUE,
              profile_image TEXT,

              country VARCHAR(2) NOT NULL DEFAULT 'BR',
              timezone VARCHAR(100) NOT NULL DEFAULT 'America/Sao_Paulo',

              active BOOLEAN NOT NULL DEFAULT true,

              verified_at TIMESTAMPTZ,
              created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
              deleted_at TIMESTAMPTZ
            );

            CREATE INDEX idx_companies_active ON companies(active);
            CREATE INDEX idx_companies_deleted_at ON companies(deleted_at);
        `);
  },

  async down(query) {
    await query(`
            DROP TABLE IF EXISTS companies;
        `);
  }
};