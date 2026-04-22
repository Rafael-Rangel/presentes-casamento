import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Cron (ex.: Netlify Scheduled Function em `netlify/functions/expire-reservations.mjs`):
 * expira reservas com `expires_at` passado e repõe presentes.
 * **CRON_SECRET**: o mesmo valor nas env vars; pedido com `Authorization: Bearer …`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET não configurado" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc("run_expire_stale_reservations");

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      expiredCount: typeof data === "number" ? data : 0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
