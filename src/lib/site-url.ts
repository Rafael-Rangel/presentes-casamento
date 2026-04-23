import { headers } from "next/headers";

function normalizeBase(raw?: string | null): string | undefined {
  const t = raw?.trim().replace(/\/$/, "");
  return t || undefined;
}

/**
 * Ordem: env explícito → Netlify (previews: URL do deploy; produção: URL principal) → Vercel.
 * Usado em magic link, emails, links de convite e metadataBase.
 */
function resolvePublicSiteBaseFromEnv(): string | undefined {
  const explicit = normalizeBase(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit?.startsWith("http")) {
    return explicit;
  }

  const ctx = process.env.CONTEXT;
  const isPreview = ctx === "deploy-preview" || ctx === "branch-deploy";
  const url = normalizeBase(process.env.URL);
  const prime = normalizeBase(process.env.DEPLOY_PRIME_URL);
  const deploy = normalizeBase(process.env.DEPLOY_URL);

  const netlifyChain = isPreview
    ? [prime, deploy, url]
    : [url, prime, deploy];

  for (const t of netlifyChain) {
    if (t?.startsWith("http")) {
      return t;
    }
  }

  const vercel = normalizeBase(process.env.VERCEL_URL);
  if (vercel) {
    if (vercel.startsWith("http://") || vercel.startsWith("https://")) {
      return vercel;
    }
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return undefined;
}

/**
 * URL absoluta do site (magic link, emails, links em convites).
 * Define **NEXT_PUBLIC_SITE_URL** em produção (domínio final com https).
 * Fallbacks em build/deploy: Netlify **URL** / **DEPLOY_PRIME_URL** / **DEPLOY_URL**, **VERCEL_URL**.
 */
export async function getSiteUrl(): Promise<string> {
  const fromEnv = resolvePublicSiteBaseFromEnv();
  if (fromEnv) {
    return fromEnv;
  }

  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000")
    .split(",")[0]
    ?.trim();
  const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0]?.trim() ?? "http";
  return `${proto}://${host}`;
}

/** Versão síncrona para `metadataBase` no layout (build e env fixo). */
export function getSiteUrlSync(): URL | undefined {
  const base = resolvePublicSiteBaseFromEnv();
  if (!base) return undefined;
  try {
    return new URL(base);
  } catch {
    return undefined;
  }
}

/**
 * Origem canónica para redirects (ex.: após OAuth/magic link).
 * Prioriza env fixo; depois cabeçalhos de proxy (Netlify); por fim `request.url`.
 */
export function getSiteOriginFromRequest(request: Request): string {
  const fromEnv = resolvePublicSiteBaseFromEnv();
  if (fromEnv) {
    return fromEnv;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) {
      const proto = forwardedProto.split(",")[0]?.trim() || "https";
      return `${proto}://${host}`;
    }
  }

  return new URL(request.url).origin;
}
