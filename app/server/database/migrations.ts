import type { Migration } from "../types/migrate.js";
import { migration as create_companies_table } from "./migrations/001_create_companies_table.js";
import { migration as create_stores_table } from "./migrations/002_create_stores_table.js";
import { migration as create_users_table } from "./migrations/003_create_users_table.js";
import { migration as create_users_refresh_tokens } from "./migrations/004_create_users_refresh_tokens_table.js";

export const migrations: Migration[] = [
    create_companies_table,
    create_stores_table,
    create_users_table,
    create_users_refresh_tokens,
]