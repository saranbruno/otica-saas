import type { Migration } from "../../types/migrate.js";

export const migration: Migration = {
  name: "create_stores",

  async up(query) {
    await query(`
            CREATE TABLE stores (
              id UUID PRIMARY KEY DEFAULT uuidv7(),
              public_id VARCHAR(50) NOT NULL UNIQUE,

              company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

              name VARCHAR(255) NOT NULL,
              profile_image TEXT,

              zip_code VARCHAR(20),
              street VARCHAR(255),
              number VARCHAR(50),
              district VARCHAR(255),
              city VARCHAR(255),
              state VARCHAR(100),

              active BOOLEAN NOT NULL DEFAULT true,

              created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
              deleted_at TIMESTAMPTZ
            );

            CREATE INDEX idx_stores_company_id ON stores(company_id);
            CREATE INDEX idx_stores_active ON stores(active);
            CREATE INDEX idx_stores_deleted_at ON stores(deleted_at);
        `);
  },

  async down(query) {
    await query(`
            DROP TABLE IF EXISTS stores;
        `);
  }
};