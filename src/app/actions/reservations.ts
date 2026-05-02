"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { sendMail } from "@/lib/mail";
import { isPushConfigured, sendPushToProfileSafe } from "@/lib/push-notify";
import { isGuestProfileComplete } from "@/lib/profile-complete";
import { guestProfileSchema } from "@/lib/validations/profile";
import { reserveGiftSchema } from "@/lib/validations/reservation";
import { revalidatePath } from "next/cache";

export type ActionState = { ok: boolean; error?: string };

export async function reserveGift(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Inicia sessão para reservar." };
  }

  const parsed = reserveGiftSchema.safeParse({
    giftId: formData.get("giftId"),
    message: formData.get("message") ?? "",
    purchaseEstimate: formData.get("purchaseEstimate") ?? undefined,
    isSurprise: formData.get("isSurprise") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().formErrors.join("; ") || "Dados inválidos",
    };
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select(
      "id, full_name, phone, relationship_note, profile_completed_at, marketing_opt_in",
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileErr || !profile) {
    return { ok: false, error: "Perfil não encontrado." };
  }

  const profRow = profile as {
    id: string;
    full_name: string;
    phone: string | null;
    relationship_note: string | null;
    profile_completed_at: string | null;
    marketing_opt_in: boolean | null;
  };

  if (!isGuestProfileComplete(profRow)) {
    const parsedProf = guestProfileSchema.safeParse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      relationshipNote: formData.get("relationshipNote"),
      marketingOptIn: formData.get("marketingOptInProfile"),
    });

    if (!parsedProf.success) {
      const fe = parsedProf.error.flatten().fieldErrors;
      return {
        ok: false,
        error:
          fe.fullName?.[0] ??
          fe.phone?.[0] ??
          fe.relationshipNote?.[0] ??
          "Preenche nome, telefone e como conheces os noivos para reservar.",
      };
    }

    const u = parsedProf.data;
    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        full_name: u.fullName,
        email: user.email ?? "",
        phone: u.phone,
        relationship_note: u.relationshipNote,
        marketing_opt_in: u.marketingOptIn,
        profile_completed_at: new Date().toISOString(),
      })
      .eq("auth_user_id", user.id);

    if (upErr) {
      return { ok: false, error: upErr.message };
    }
  }

  const { giftId, message, purchaseEstimate, isSurprise } = parsed.data;
  const dateStr = purchaseEstimate ?? null;

  const { data, error } = await supabase.rpc("reserve_gift", {
    p_gift_id: giftId,
    p_message: message,
    p_purchase_estimate: dateStr,
    p_is_surprise: isSurprise,
  });

  if (error) {
    const msg =
      error.message.includes("não disponível") ||
      error.message.includes("não dispon")
        ? "Este presente já não está disponível."
        : error.message;
    return { ok: false, error: msg };
  }

  if (!data) {
    return { ok: false, error: "Não foi possível concluir a reserva." };
  }

  const { data: giftRow } = await supabase
    .from("gifts")
    .select("title")
    .eq("id", giftId)
    .maybeSingle();

  const giftTitle = (giftRow as { title: string } | null)?.title ?? "Presente";
  const to = user.email;
  if (to) {
    const siteUrl = await getSiteUrl();
    const fromName = process.env.EMAIL_FROM_NAME ?? "Casamento";
    const html = `
<p>Olá,</p>
<p>Obrigado por reservares <strong>${escapeHtml(giftTitle)}</strong> na nossa lista de presentes.</p>
<p>Podes rever a reserva em <a href="${siteUrl}/conta">Minhas reservas</a>.</p>
<p>Com carinho,<br/>${escapeHtml(fromName)}</p>
`.trim();
    const text = `Obrigado por reservares "${giftTitle}". Vê as tuas reservas em ${siteUrl}/conta`;

    const mailResult = await sendMail({
      to,
      subject: `Reserva confirmada — ${giftTitle}`,
      text,
      html,
    });

    if (!mailResult.ok) {
      console.error("[reserveGift] Email não enviado:", mailResult.error);
    } else if (mailResult.sent === false) {
      console.warn("[reserveGift] SMTP não configurado:", mailResult.reason);
    }
  }

  if (isPushConfigured()) {
    const siteUrlPush = await getSiteUrl();
    void sendPushToProfileSafe(profRow.id, {
      title: "Reserva confirmada",
      body: `Reservaste «${giftTitle}». Abre para ver em Minhas reservas.`,
      url: `${siteUrlPush}/conta`,
      tag: `reservation-${giftId}`,
    });
  }

  revalidatePath("/presentes");
  revalidatePath(`/presentes/${giftId}`);
  revalidatePath("/conta");
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
