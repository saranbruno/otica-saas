import { pool, query, transaction } from "../providers/psql.js";
import { migrations } from "./migrations.js";

async function getLastMigration() {
    const result = await query(`
    SELECT name 
    FROM migrations 
    ORDER BY executed_at DESC, id DESC 
    LIMIT 1
  `);

    return result[0]?.name as string | undefined;
}

async function run() {
    const lastMigrationName = await getLastMigration();

    if (!lastMigrationName) {
        console.log("Nenhuma migration para reverter.");
        await pool.end();
        return;
    }

    const migration = migrations.find((item) => item.name === lastMigrationName);

    if (!migration) {
        throw new Error(`Migration não encontrada: ${lastMigrationName}`);
    }

    console.log(`Revertendo: ${migration.name}`);

    await transaction(async (client) => {
        await migration.down(client);
        
        await client(
            `DELETE FROM migrations WHERE name = $1`,
            [migration.name]
        );

        console.log(`Revertida: ${migration.name}`);
    });

    await pool.end();
}

run().catch((err) => {
    console.error("Erro ao reverter migration:", err);
    process.exit(1);
});