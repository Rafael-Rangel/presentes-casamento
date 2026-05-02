import { getSiteOriginFromRequest } from "@/lib/site-url";
import { isGuestProfileComplete } from "@/lib/profile-complete";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = getSiteOriginFromRequest(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") ?? "/";
  const next = nextRaw.startsWith("/") ? nextRaw : `/${nextRaw}`;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const skipDados =
        next.startsWith("/conta/dados") ||
        next.startsWith("/admin") ||
        next.startsWith("/login");

      if (user && !skipDados) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, phone, relationship_note, profile_completed_at")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (
          prof &&
          !isGuestProfileComplete(
            prof as {
              full_name: string;
              phone: string | null;
              relationship_note: string | null;
              profile_completed_at: string | null;
            },
          )
        ) {
          const qs = new URLSearchParams({ next });
          return NextResponse.redirect(`${origin}/conta/dados?${qs.toString()}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
