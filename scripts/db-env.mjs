/**
 * Carrega .env.local / .env e valida DATABASE_URL para comandos que falam com Postgres.
 */

import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(__dirname, "..");

export function loadDbEnv() {
  config({ path: resolve(projectRoot, ".env.local") });
  config({ path: resolve(projectRoot, ".env") });
}

/**
 * Ligação direta ao Postgres (host db.{ref}.supabase.co:5432).
 * @returns {string | null}
 */
function buildDirectPostgresUriFromCliEnv() {
  const ref = process.env.SUPABASE_PROJECT_REF?.trim();
  const pwd = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!ref || !pwd) return null;
  return `postgresql://postgres:${encodeURIComponent(pwd)}@db.${ref}.supabase.co:5432/postgres`;
}

/**
 * @returns {string}
 */
export function getDatabaseUrl() {
  loadDbEnv();
  const raw = process.env.DATABASE_URL?.trim();
  const fromPassword = buildDirectPostgresUriFromCliEnv();

  if (raw && /^postgres(ql)?:\/\//i.test(raw)) {
    return raw;
  }

  if (raw && /^https?:\/\//i.test(raw)) {
    if (fromPassword) {
      console.warn(
        "DATABASE_URL parece URL HTTP (API REST). A usar SUPABASE_PROJECT_REF + SUPABASE_DB_PASSWORD para Postgres direto.",
      );
      return fromPassword;
    }
    assertPostgresConnectionUri(raw);
  }

  if (fromPassword) {
    return fromPassword;
  }

  if (!raw) {
    console.error(
      "Define no .env.local uma destas opções:\n" +
        "  • DATABASE_URL=postgresql://... (Settings → Database → Connection string → URI), ou\n" +
        "  • SUPABASE_PROJECT_REF=... e SUPABASE_DB_PASSWORD=... (password da base no dashboard).\n" +
        "Não uses https://.../rest/v1/ como DATABASE_URL.",
    );
    process.exit(1);
  }

  assertPostgresConnectionUri(raw);
  return raw;
}

/**
 * @param {string} url
 */
function assertPostgresConnectionUri(url) {
  if (/^https?:\/\//i.test(url)) {
    console.error(
      "DATABASE_URL não pode ser uma URL HTTP(S) da API (ex. ...supabase.co/rest/v1/).\n" +
        "Usa a URI Postgres do dashboard: postgresql://postgres.[ref]:SENHA@... ou o formato “URI” com pooler.\n" +
        "A password na URI tem de estar percent-encoded se tiver @, #, etc.",
    );
    process.exit(1);
  }
  if (!/^postgres(ql)?:\/\//i.test(url)) {
    console.error(
      "DATABASE_URL tem de ser uma connection string Postgres (começa por postgresql:// ou postgres://).",
    );
    process.exit(1);
  }
}
