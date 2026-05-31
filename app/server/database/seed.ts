import { pool } from "../providers/psql.js";


async function run() {
  await (async () => {})();

  console.log("Seeders executados com sucesso.");

  await pool.end();
}

run().catch((err) => {
  console.error("Erro ao executar seeders:", err);
  process.exit(1);
});