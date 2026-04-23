import { signOut } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { Gift, LogIn, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navLink =
    "inline-flex min-h-[44px] shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition sm:px-3.5";

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-paper/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2 font-display text-base font-medium tracking-tight text-ink sm:gap-2.5 sm:text-lg"
        >
          <BrandLogo
            size="sm"
            className="shadow-sm ring-1 ring-border/80 transition group-hover:ring-ocean/25"
          />
          <span className="hidden truncate sm:inline">Casamento</span>
        </Link>
        <nav
          className="flex max-w-[calc(100vw-5.5rem)] flex-nowrap items-center justify-end gap-0.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-none sm:flex-wrap sm:gap-1 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Navegação principal"
        >
          <Link
            href="/presentes"
            className={`${navLink} text-muted hover:bg-canvas hover:text-ink`}
          >
            <Gift className="h-4 w-4 shrink-0 text-ocean" strokeWidth={1.75} aria-hidden />
            Presentes
          </Link>
          <Link
            href="/admin"
            className={`${navLink} text-ocean-deep hover:bg-ocean/10`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden />
            Noivos
          </Link>
          {user ? (
            <>
              <Link
                href="/conta"
                className={`${navLink} text-muted hover:bg-canvas hover:text-ink`}
              >
                Reservas
              </Link>
              <form action={signOut} className="inline shrink-0">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] touch-manipulation items-center justify-center gap-1.5 rounded-full border border-border bg-paper px-3 py-2 text-xs font-medium text-muted transition hover:border-terracotta/40 hover:text-ink sm:px-3.5"
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-[44px] shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-full bg-ocean-deep px-3.5 py-2 text-xs font-semibold text-paper shadow-md transition hover:bg-ocean sm:px-4"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
