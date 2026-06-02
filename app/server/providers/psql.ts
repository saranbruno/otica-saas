import 'dotenv/config';
import {
    Pool,
    type PoolClient,
    type QueryResultRow
} from 'pg';

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
    console.error(
        'Erro inesperado em cliente ocioso do PostgreSQL:',
        err
    );
});

type QueryExecutor = Pool | PoolClient;

export async function fetchFirst<T>(
    sql: string,
    params?: unknown[],
    executor: QueryExecutor = pool
): Promise<T | null> {
    const [row] = await query(sql, params, executor);

    return (row as T) ?? null;
}

export async function query<T extends QueryResultRow>(
    sql: string,
    params?: unknown[],
    executor: QueryExecutor = pool
): Promise<T[]> {
    const result = await executor.query<T>(sql, params);

    return result.rows;
}

export async function transaction<T>(
    callback: (
        query: <R extends QueryResultRow>(
            sql: string,
            params?: unknown[]
        ) => Promise<R[]>
    ) => Promise<T>
): Promise<T> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const trxQuery = <R extends QueryResultRow>(
            sql: string,
            params?: unknown[]
        ) => query<R>(sql, params, client);

        const result = await callback(trxQuery);

        await client.query('COMMIT');

        return result;
    } catch (error) {
        await client.query('ROLLBACK');

        throw error;
    } finally {
        client.release();
    }
}

export function getUpdateKeysValues(entries: any[]): {
    fields: string[],
    values: any[],
} {
    const fields = entries.map(
        ([key], index) => `${key} = $${index + 1}`
    );

    const values = entries.map(([, value]) => value);

    return {
        fields,
        values,
    };
}

// transaction example
// const company = await transaction(async (query) => {
//     const [createdCompany] = await query<CompanyType>(
//         `
//         INSERT INTO companies (
//             name,
//             email
//         )
//         VALUES ($1, $2)
//         RETURNING *
//         `,
//         ['Ótica Central', 'contato@otica.com']
//     );

//     await query(
//         `
//         INSERT INTO stores (
//             company_id,
//             public_id,
//             name
//         )
//         VALUES ($1, $2, $3)
//         `,
//         [createdCompany.id, 'LOJA001', 'Matriz']
//     );

//     return createdCompany;
// });