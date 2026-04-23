/**
 * Netlify Scheduled Function — corre em deploys de produção (UTC, @hourly).
 * Chama GET /api/cron/expire-reservations com Authorization: Bearer CRON_SECRET.
 *
 * Variáveis na Netlify: CRON_SECRET (obrigatório), URL (definido automaticamente).
 */
function resolveCronBase() {
  const trim = (s) => s?.trim().replace(/\/$/, "");
  const explicit = trim(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit?.startsWith("http")) return explicit;

  const ctx = process.env.CONTEXT;
  const isPreview = ctx === "deploy-preview" || ctx === "branch-deploy";
  const url = trim(process.env.URL);
  const prime = trim(process.env.DEPLOY_PRIME_URL);
  const deploy = trim(process.env.DEPLOY_URL);
  const chain = isPreview ? [prime, deploy, url] : [url, prime, deploy];
  for (const t of chain) {
    if (t?.startsWith("http")) return t;
  }
  return undefined;
}

export default async function handler() {
  const base = resolveCronBase();
  const secret = process.env.CRON_SECRET;

  if (!base) {
    console.error(
      "[expire-reservations] Falta URL base (URL, DEPLOY_PRIME_URL ou NEXT_PUBLIC_SITE_URL).",
    );
    return new Response(JSON.stringify({ ok: false, error: "URL em falta" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  if (!secret) {
    console.error("[expire-reservations] Falta CRON_SECRET.");
    return new Response(
      JSON.stringify({ ok: false, error: "CRON_SECRET em falta" }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const url = `${base}/api/cron/expire-reservations`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${secret}` },
  });

  const body = await res.text();
  console.log("[expire-reservations]", res.status, body.slice(0, 500));

  return new Response(body, {
    status: res.ok ? 200 : res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
