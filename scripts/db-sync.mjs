#!/usr/bin/env node
/**
 * Aplica `supabase/schema.sql` e/ou `supabase/seed_mock_demo.sql` na BD remota.
 * Usa o pacote `pg` (query simples) para suportar ficheiros com vários comandos; o
 * `supabase db query -f` falha com "multiple commands" em prepared statements.
 *
 * Credenciais: `DATABASE_URL` ou `SUPABASE_PROJECT_REF` + `SUPABASE_DB_PASSWORD` (ver db-env.mjs).
 */

import fs from "node:fs";
import { resolve } from "node:path";
import pg from "pg";
import { getDatabaseUrl, projectRoot } from "./db-env.mjs";

const root = projectRoot;
const seedOnly = process.argv.includes("--seed-only");

/** @param {string} dbUrl */
function pgConfig(dbUrl) {
  return {
    connectionString: dbUrl,
    // Supabase usa TLS; sem isto pode falhar validação da cadeia no cliente Node.
    ssl: { rejectUnauthorized: false },
  };
}

/**
 * @param {pg.Client} client
 * @param {string} label
 * @param {string} relativePath
 */
async function runSqlFile(client, label, relativePath) {
  const path = resolve(root, relativePath);
  const sql = fs.readFileSync(path, "utf8");
  console.error(`→ ${label}`);
  await client.query(sql);
}

async function main() {
  const dbUrl = getDatabaseUrl();
  const client = new pg.Client(pgConfig(dbUrl));
  await client.connect();
  try {
    if (!seedOnly) {
      await runSqlFile(client, "supabase/schema.sql", "supabase/schema.sql");
    }
    await runSqlFile(client, "supabase/seed_mock_demo.sql", "supabase/seed_mock_demo.sql");
  } finally {
    await client.end();
  }
  console.log(seedOnly ? "OK: seed mock aplicado." : "OK: schema + seed mock aplicados.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
