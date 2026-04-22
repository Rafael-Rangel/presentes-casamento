/**
 * Copia `imagens_casal/` → `public/imagens_casal/` antes do build.
 * Necessário na Vercel (symlinks relativos fora de public podem falhar).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "imagens_casal");
const dest = path.join(root, "public", "imagens_casal");

if (!fs.existsSync(src)) {
  console.warn("[copy-couple-photos] Pasta imagens_casal não encontrada — a saltar.");
  process.exit(0);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log("[copy-couple-photos] Copiado para public/imagens_casal");
