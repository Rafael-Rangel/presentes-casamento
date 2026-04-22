"use server";

import { requireAdminOrRedirect } from "@/lib/require-admin";
import { getServiceClientOrError } from "@/lib/supabase/service";
import { guestFormSchema } from "@/lib/validations/guest";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type GuestActionState = { ok: boolean; error?: string; slug?: string };

export async function createGuest(
  _prev: GuestActionState | null,
  formData: FormData,
): Promise<GuestActionState> {
  await requireAdminOrRedirect();
  const parsed = guestFormSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().formErrors.join("; ") || "Dados inválidos",
    };
  }
  const v = parsed.data;
  const slug = nanoid(12);
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }
  const { error } = await svc.supabase.from("guests").insert({
    slug,
    display_name: v.displayName,
    email: v.email ?? null,
    phone: v.phone ?? null,
    notes: v.notes,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/convidados");
  return { ok: true, slug };
}

export async function deleteGuestForm(
  _prev: GuestActionState | null,
  formData: FormData,
): Promise<GuestActionState> {
  await requireAdminOrRedirect();
  const id = formData.get("guestId");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "ID inválido" };
  }
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }
  const { error } = await svc.supabase.from("guests").delete().eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/convidados");
  redirect("/admin/convidados");
}
