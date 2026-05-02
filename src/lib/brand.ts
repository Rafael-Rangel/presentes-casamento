/** Logo da identidade (ficheiro em `/public`). Usada no header, login admin, favicon e manifest. */
export const BRAND_LOGO_SRC = "/il_794xN.6027018536_72v0.avif" as const;

/**
 * Caminho canónico do favicon nas páginas (`metadata.icons`).
 * O `next.config` faz rewrite para {@link BRAND_LOGO_SRC} para browsers que pedem `/favicon.ico`.
 */
export const BRAND_FAVICON_PATH = "/favicon.ico" as const;

export const BRAND_LOGO_ALT = "Casamento";
