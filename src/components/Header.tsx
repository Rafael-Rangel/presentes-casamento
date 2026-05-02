import { HeaderNavLinks } from "@/components/header-nav-links";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        <HeaderNavLinks isAuthenticated={!!user} />
      </div>
    </header>
  );
}
