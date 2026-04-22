"use server";

import { requireAdminOrRedirect } from "@/lib/require-admin";
import { getSiteUrl } from "@/lib/site-url";
import { sendMail } from "@/lib/mail";
import { getServiceClientOrError } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export type InviteMailState = { ok: boolean; error?: string; message?: string };

export async function sendGuestInviteEmail(
  guestId: string,
): Promise<InviteMailState> {
  await requireAdminOrRedirect();
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }
  const { data, error } = await svc.supabase
    .from("guests")
    .select("display_name, slug, email")
    .eq("id", guestId)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Convidado não encontrado." };
  }
  if (!data.email?.trim()) {
    return { ok: false, error: "Este convidado não tem email." };
  }

  const base = await getSiteUrl();
  const link = `${base}/convite/${data.slug}`;
  const r = await sendMail({
    to: data.email,
    subject: "O teu convite personalizado",
    text: `Olá ${data.display_name}!\n\nAqui está o teu convite (guarda este link):\n${link}\n\nNa mesma página podes aceder à lista de presentes do casamento.`,
  });

  if (!r.ok) {
    return { ok: false, error: r.error };
  }
  if (!r.sent) {
    return { ok: true, message: r.reason };
  }
  return { ok: true, message: "Email enviado." };
}

export async function sendGuestInviteFormAction(formData: FormData) {
  await requireAdminOrRedirect();
  const id = formData.get("guestId");
  if (typeof id !== "string" || !id) {
    redirect("/admin/convidados?flash=invalid");
  }
  const res = await sendGuestInviteEmail(id);
  const msg = res.ok ? (res.message ?? "ok") : (res.error ?? "erro");
  redirect(`/admin/convidados?flash=${encodeURIComponent(msg)}`);
}
