#!/usr/bin/env node
/**
 * Imprime contagens nas tabelas principais e verifica o bucket `gift-images` (storage).
 * Requer DATABASE_URL no .env.local.
 */

import { spawnSync } from "node:child_process";
import { getDatabaseUrl, projectRoot } from "./db-env.mjs";

const root = projectRoot;
const dbUrl = getDatabaseUrl();

const sql = `
SELECT
  (SELECT count(*)::bigint FROM public.gifts) AS gifts,
  (SELECT count(*)::bigint FROM public.guests) AS guests,
  (SELECT count(*)::bigint FROM public.reservations) AS reservations,
  (SELECT count(*)::bigint FROM public.profiles) AS profiles,
  (SELECT count(*)::bigint FROM storage.buckets WHERE id = 'gift-images') AS gift_images_bucket;
`.trim();

console.log("Contagens (após seed esperam várias linhas em gifts/guests):\n");

const r = spawnSync(
  "npx",
  ["supabase", "db", "query", "--db-url", dbUrl, "--agent", "no", "-o", "table", sql],
  { cwd: root, stdio: "inherit", env: { ...process.env } },
);

if (r.error) {
  console.error(r.error.message);
  process.exit(1);
}
if (r.status !== 0) {
  process.exit(r.status ?? 1);
}
