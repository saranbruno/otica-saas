import { pool } from "../providers/psql.js";
import { seed as seed_companies } from "./seeders/seed_companies.js";
import { seed as seed_stores } from "./seeders/seed_stores.js";
import { seed as seed_users } from "./seeders/seed_users.js";

async function run() {
  await (async () => {
    await seed_companies();
    await seed_stores();
    await seed_users();
  })();

  console.log("Seeders executados com sucesso.");

  await pool.end();
}

run().catch((err) => {
  console.error("Erro ao executar seeders:", err);
  process.exit(1);
});