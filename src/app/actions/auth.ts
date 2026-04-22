"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { redirect } from "next/navigation";
import { z } from "zod";

const emailSchema = z.string().email("Email inválido");

export type AuthActionState = { ok: boolean; error?: string; message?: string };

export async function signInWithMagicLink(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const emailRaw = formData.get("email");
  const parsed = emailSchema.safeParse(
    typeof emailRaw === "string" ? emailRaw.trim() : "",
  );
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().formErrors.join("; ") || "Email inválido",
    };
  }

  const nextRaw = formData.get("next");
  const next =
    typeof nextRaw === "string" && nextRaw.startsWith("/") ? nextRaw : "/";

  const siteUrl = await getSiteUrl();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    message: "Verifica o teu email — enviámos um link para iniciares sessão.",
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
