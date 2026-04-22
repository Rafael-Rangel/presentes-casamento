import { signOut } from "@/app/actions/auth";
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@/lib/brand";
import { createClient } from "@/lib/supabase/server";
import { Gift, LogIn, LogOut, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-lg font-medium tracking-tight text-ink"
        >
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-border/80 transition group-hover:ring-ocean/25">
            <Image
              src={BRAND_LOGO_SRC}
              alt={BRAND_LOGO_ALT}
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </span>
          <span className="hidden sm:inline">Casamento</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link
            href="/presentes"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
          >
            <Gift className="h-4 w-4 text-ocean" strokeWidth={1.75} aria-hidden />
            Presentes
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ocean-deep transition hover:bg-ocean/10"
          >
            <Sparkles className="h-4 w-4 text-terracotta" strokeWidth={1.75} aria-hidden />
            Noivos
          </Link>
          {user ? (
            <>
              <Link
                href="/conta"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
              >
                Reservas
              </Link>
              <form action={signOut} className="inline">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-paper px-3 py-2 text-xs font-medium text-muted transition hover:border-terracotta/40 hover:text-ink"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden />
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-ocean-deep px-3.5 py-2 text-xs font-semibold text-paper shadow-md transition hover:bg-ocean"
            >
              <LogIn className="h-3.5 w-3.5" aria-hidden />
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
