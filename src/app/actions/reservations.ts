"use server";

import { createClient } from "@/lib/supabase/server";
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

  revalidatePath("/presentes");
  revalidatePath(`/presentes/${giftId}`);
  revalidatePath("/conta");
  return { ok: true };
}
