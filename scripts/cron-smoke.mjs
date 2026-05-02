/**
 * Testa GET /api/cron/expire-reservations e /api/cron/gift-reminders com Bearer CRON_SECRET.
 * Usa depois do deploy para confirmar 200 e JSON ok (ou corre localmente contra dev server).
 *
 * Uso:
 *   BASE_URL=https://teu-site.netlify.app node scripts/cron-smoke.mjs
 *   node scripts/cron-smoke.mjs --skip-expire   # só gift-reminders (útil se RPC expire ainda não na BD)
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

const base =
  process.env.BASE_URL?.trim().replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
const secret = process.env.CRON_SECRET?.trim();

if (!base?.startsWith("http")) {
  console.error("Define BASE_URL ou NEXT_PUBLIC_SITE_URL (URL absoluta do site).");
  process.exit(1);
}
if (!secret) {
  console.error("Define CRON_SECRET.");
  process.exit(1);
}

const skipExpire = process.argv.includes("--skip-expire");
const paths = skipExpire
  ? ["/api/cron/gift-reminders"]
  : ["/api/cron/expire-reservations", "/api/cron/gift-reminders"];

for (const p of paths) {
  const url = `${base}${p}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  const ok = res.ok && json && typeof json === "object" && json.ok === true;
  console.log(`${ok ? "OK" : "FALHA"} ${res.status} ${p}`);
  console.log(typeof json === "string" ? json.slice(0, 400) : JSON.stringify(json));
  if (!ok) process.exit(1);
}

console.log("\nCrons responderam com ok: true.");
