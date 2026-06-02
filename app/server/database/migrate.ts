import { pool, query, transaction } from "../providers/psql.js";
import { migrations } from "./migrations.js";

async function ensureMigrationsTable() {
    await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

async function hasMigrationRun(name: string) {
    const result = await query(
        `SELECT name FROM migrations WHERE name = $1`,
        [name]
    );

    return result.length > 0;
}

async function run() {
    await ensureMigrationsTable();

    for (const migration of migrations) {
        const alreadyRan = await hasMigrationRun(migration.name);

        if (alreadyRan) {
            console.log(`Ignorando: ${migration.name}`);
            continue;
        }

        console.log(`Executando: ${migration.name}`);

        await transaction(async (client) => {
            await migration.up(client);

            await client(
                `
                INSERT INTO migrations (name)
                VALUES ($1)
                `,
                [migration.name]
            );
        });

        console.log(`Concluída: ${migration.name}`);
    }

    await pool.end();
}

run().catch((err) => {
    console.error("Erro ao executar migrations:", err);
    process.exit(1);
});