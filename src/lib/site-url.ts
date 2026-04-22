import { headers } from "next/headers";

/**
 * URL absoluta do site (magic link, emails, links em convites).
 * Em produção na Vercel define **NEXT_PUBLIC_SITE_URL** (domínio final com https).
 * Em previews, se não estiver definido, usa **VERCEL_URL** (https).
 */
export async function getSiteUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit?.startsWith("http")) {
    return explicit;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** Versão síncrona para `metadataBase` no layout (só com env fixo). */
export function getSiteUrlSync(): URL | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit?.startsWith("http")) {
    return new URL(explicit);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel.replace(/^https?:\/\//, "")}`);
  }
  return undefined;
}
