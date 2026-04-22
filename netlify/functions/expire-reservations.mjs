/**
 * Netlify Scheduled Function — corre em deploys de produção (UTC, @hourly).
 * Chama GET /api/cron/expire-reservations com Authorization: Bearer CRON_SECRET.
 *
 * Variáveis na Netlify: CRON_SECRET (obrigatório), URL (definido automaticamente).
 */
export default async function handler() {
  const base = process.env.URL?.replace(/\/$/, "");
  const secret = process.env.CRON_SECRET;

  if (!base) {
    console.error("[expire-reservations] Falta URL (env URL da Netlify).");
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
