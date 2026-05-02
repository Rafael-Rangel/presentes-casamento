"use client";

import { signOut } from "@/app/actions/auth";
import { Gift, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isAuthenticated: boolean;
};

const navLink =
  "inline-flex min-h-[44px] shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition sm:px-3.5";

export function HeaderNavLinks({ isAuthenticated }: Props) {
  const pathname = usePathname() ?? "";
  const onPresentes =
    pathname === "/presentes" || pathname.startsWith("/presentes/");

  return (
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
      {isAuthenticated ? (
        <>
          {!onPresentes && (
            <Link
              href="/conta"
              className={`${navLink} text-muted hover:bg-canvas hover:text-ink`}
            >
              Reservas
            </Link>
          )}
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
  );
}
