import { headers } from "next/headers";

/**
 * URL absoluta do site (magic link, emails, links em convites).
 * Define **NEXT_PUBLIC_SITE_URL** em produção (domínio final com https).
 * Fallbacks: **URL** (Netlify), **DEPLOY_PRIME_URL**, **VERCEL_URL** (previews).
 */
export async function getSiteUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit?.startsWith("http")) {
    return explicit;
  }

  const netlifyUrl = process.env.URL?.trim();
  if (netlifyUrl?.startsWith("http")) {
    return netlifyUrl.replace(/\/$/, "");
  }

  const deployPrime = process.env.DEPLOY_PRIME_URL?.trim();
  if (deployPrime?.startsWith("http")) {
    return deployPrime.replace(/\/$/, "");
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
  const netlifyUrl = process.env.URL?.trim();
  if (netlifyUrl?.startsWith("http")) {
    return new URL(netlifyUrl);
  }
  const deployPrime = process.env.DEPLOY_PRIME_URL?.trim();
  if (deployPrime?.startsWith("http")) {
    return new URL(deployPrime);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel.replace(/^https?:\/\//, "")}`);
  }
  return undefined;
}
