import { pool } from "../providers/psql.js";
import getLogContent from "../utils/logger/getLogContent.js";
import { RequestErrorLog } from "../utils/logger/requestError.js";
import { seed as seed_companies } from "./seeders/seed_companies.js";
import { seed as seed_stores } from "./seeders/seed_stores.js";
import { seed as seed_user_store_access } from "./seeders/seed_user_store_access.js";
import { seed as seed_users } from "./seeders/seed_users.js";

async function run() {
  await (async () => {
    await seed_companies();
    await seed_stores();
    await seed_users();
    await seed_user_store_access();
  })();

  await pool.end();
}

run().catch((err) => {
  const {
    code,
    message,
  } = getLogContent(err);

  RequestErrorLog({
    route: "database_seed",
    code,
    message,
    error: err,
    payload: {},
  });

  process.exit(1);
});
