/**
 * Valida variáveis necessárias para um deploy em produção (Netlify).
 * Carrega `.env.local` e `.env` (mesma ordem que outros scripts).
 *
 * Modo `--production`: depois carrega `.env.production.local` (override) para validar
 * URL https e senhas fortes sem mudares o `NEXT_PUBLIC_SITE_URL=http://localhost` do dia-a-dia.
 * Copia `.env.production.example` → `.env.production.local` e ajusta (gitignored).
 *
 * Uso:
 *   npm run deploy:check-env
 *   npm run deploy:check-env:production
 */

import { existsSync } from "node:fs";
import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

const production = process.argv.includes("--production");
const prodLocal = resolve(root, ".env.production.local");

if (production && existsSync(prodLocal)) {
  config({ path: prodLocal, override: true });
  console.log("(Carregado .env.production.local — overrides para validação de produção)\n");
} else if (production) {
  console.warn(
    "(Aviso: sem .env.production.local — NEXT_PUBLIC_SITE_URL continua o de dev; https:// e outras regras podem falhar. Copia .env.production.example)\n",
  );
}

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "CRON_SECRET",
];

const SMTP_OPTIONAL = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "EMAIL_FROM",
];

function nonempty(k) {
  const v = process.env[k];
  return typeof v === "string" && v.trim().length > 0;
}

let failed = false;

console.log("Variáveis obrigatórias (app + cron):\n");
for (const k of REQUIRED) {
  const ok = nonempty(k);
  if (!ok) failed = true;
  console.log(`  ${ok ? "[ok]" : "[falta]"} ${k}`);
}

if (production) {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!url.startsWith("https://")) {
    console.error("\n[produção] NEXT_PUBLIC_SITE_URL deve começar por https://");
    failed = true;
  }
  const adminPwd = process.env.ADMIN_PASSWORD ?? "";
  if (adminPwd.length < 12) {
    console.error(
      "\n[produção] ADMIN_PASSWORD deve ter pelo menos 12 caracteres (senha forte).",
    );
    failed = true;
  }
  const sess = process.env.ADMIN_SESSION_SECRET ?? "";
  if (sess.length < 16) {
    console.error(
      "\n[produção] ADMIN_SESSION_SECRET deve ter pelo menos 16 caracteres.",
    );
    failed = true;
  }
}

console.log("\nSMTP (emails transacionais / lembretes — opcional mas recomendado):\n");
let smtpOk = true;
for (const k of SMTP_OPTIONAL) {
  const ok = nonempty(k);
  if (!ok) smtpOk = false;
  console.log(`  ${ok ? "[ok]" : "[opcional]"} ${k}`);
}
if (!smtpOk) {
  console.log(
    "\n  (○ = em falta — a app funciona; só não envia emails até preencheres todas as SMTP_*)",
  );
}

process.exit(failed ? 1 : 0);
