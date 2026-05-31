import 'dotenv/config';
import { Pool, type QueryResultRow } from 'pg';

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
});

pool.on('error', (err) => {
    console.error('Erro inesperado em cliente ocioso do PostgreSQL:', err);
});

export async function query<T extends QueryResultRow = any>(
    sql: string,
    params?: unknown[]
): Promise<T[]> {
    const result = await pool.query<T>(sql, params);
    return result.rows;
}