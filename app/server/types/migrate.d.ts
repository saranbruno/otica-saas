import type { QueryResultRow } from "pg";

export type MigrationQuery = <R extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[]
) => Promise<R[]>;

export type Migration = {
    name: string;
    up: (query: MigrationQuery) => Promise<void>;
    down: (query: MigrationQuery) => Promise<void>;
};