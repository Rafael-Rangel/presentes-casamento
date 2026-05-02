import { sendPushToProfile } from "@/lib/push-notify";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ ok: false, error: "Perfil não encontrado." }, { status: 404 });
  }

  const result = await sendPushToProfile(profile.id as string, {
    title: "Lista de presentes",
    body: "Notificação de teste — se vês isto, o Web Push está a funcionar.",
    url: "/conta",
    tag: "push-test",
  });

  return NextResponse.json({
    ok: true,
    sent: result.sent,
    errors: result.errors,
  });
}
