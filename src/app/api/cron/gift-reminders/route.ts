import { createServiceClient } from "@/lib/supabase/service";
import { getSiteUrl } from "@/lib/site-url";
import { sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_SEND_PER_RUN = 30;

/**
 * Lembretes opcionais para convidados com opt-in e sem reservas.
 * Agenda na Netlify (ex.: diário) com Authorization: Bearer CRON_SECRET.
 * Gmail SMTP tem limites baixos para volume — ver README / admin definições.
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
    const siteUrl = await getSiteUrl();
    const fromName = process.env.EMAIL_FROM_NAME ?? "Casamento";

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, last_marketing_email_at")
      .eq("marketing_opt_in", true);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    const rows = profiles ?? [];
    let sent = 0;
    const now = Date.now();

    for (const p of rows) {
      if (sent >= MAX_SEND_PER_RUN) break;

      const email = (p.email as string)?.trim();
      if (!email) continue;

      const last = p.last_marketing_email_at as string | null;
      if (last) {
        const t = new Date(last).getTime();
        if (!Number.isNaN(t) && now - t < COOLDOWN_MS) continue;
      }

      const { count, error: cErr } = await supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", p.id as string);

      if (cErr) continue;
      if ((count ?? 0) > 0) continue;

      const name = (p.full_name as string)?.trim() || "Olá";
      const html = `
<p>${escapeHtml(name)},</p>
<p>Lembra-te da nossa <a href="${siteUrl}/presentes">lista de presentes</a> — ficamos felizes com o teu carinho.</p>
<p>Com carinho,<br/>${escapeHtml(fromName)}</p>
<p style="font-size:12px;color:#666">Recebeste este email porque autorizaste lembretes na nossa lista. O teu email não será usado para outros fins.</p>
`.trim();

      const mail = await sendMail({
        to: email,
        subject: "Um lembrete da lista de presentes",
        text: `${name}, visita a lista em ${siteUrl}/presentes`,
        html,
      });

      if (!mail.ok || mail.sent !== true) {
        console.warn("[gift-reminders] Falha SMTP para", email, mail);
        continue;
      }

      await supabase
        .from("profiles")
        .update({ last_marketing_email_at: new Date().toISOString() })
        .eq("id", p.id as string);

      sent++;
    }

    return NextResponse.json({ ok: true, sent });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
