/**
 * Gera valores aleatórios seguros para ADMIN_SESSION_SECRET e CRON_SECRET.
 * Copia para Netlify e .env.local; não versionar.
 *
 * Uso: node scripts/generate-secrets.mjs
 */

import { randomBytes } from "node:crypto";

const bytes = 32;
const adminSession = randomBytes(bytes).toString("hex");
const cron = randomBytes(bytes).toString("hex");
const adminPwd = randomBytes(18).toString("base64url");

console.log("Cola no Netlify e em .env.local (substitui valores antigos se estiveres a rodar segredos):\n");
console.log(`ADMIN_SESSION_SECRET=${adminSession}`);
console.log(`CRON_SECRET=${cron}`);
console.log(`\n# Sugestão forte para ADMIN_PASSWORD (produção — substitui "123456" local):\nADMIN_PASSWORD=${adminPwd}`);
console.log("\nDepois: revoga palavras-passe de app Gmail antigas no Google se estiverem comprometidas.");
