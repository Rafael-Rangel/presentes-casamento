"use server";

import { createClient } from "@/lib/supabase/server";
import { guestProfileSchema } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

export type ProfileActionState =
  | { ok: true }
  | { ok: false; error?: string };

export async function updateGuestProfile(
  _prev: ProfileActionState | null,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Inicia sessão para continuar." };
  }

  const parsed = guestProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    relationshipNote: formData.get("relationshipNote"),
    marketingOptIn: formData.get("marketingOptIn"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.flatten().fieldErrors.fullName?.[0] ??
        parsed.error.flatten().fieldErrors.phone?.[0] ??
        parsed.error.flatten().fieldErrors.relationshipNote?.[0] ??
        "Dados inválidos",
    };
  }

  const { fullName, phone, relationshipNote, marketingOptIn } = parsed.data;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      email: user.email ?? "",
      phone,
      relationship_note: relationshipNote,
      marketing_opt_in: marketingOptIn,
      profile_completed_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/conta");
  revalidatePath("/conta/dados");
  revalidatePath("/presentes");
  return { ok: true };
}
