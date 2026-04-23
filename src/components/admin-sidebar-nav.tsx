"use client";

import { Heart, Settings, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Sparkles;
  exact?: boolean;
};

const items: NavItem[] = [
  { href: "/admin", label: "Início", icon: Sparkles, exact: true },
  { href: "/admin/convidados", label: "Convidados", icon: Users },
  { href: "/admin/presentes", label: "Presentes", icon: Heart },
  { href: "/admin/definicoes", label: "Definições", icon: Settings },
];

function linkActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-row gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-col sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
      aria-label="Secções do painel"
    >
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = linkActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? "flex min-h-[44px] shrink-0 touch-manipulation items-center gap-2 rounded-xl bg-gradient-to-r from-ocean/14 to-ocean/8 px-3 py-2.5 text-sm font-semibold text-ocean-deep shadow-sm ring-1 ring-ocean/20 sm:min-h-0"
                : "flex min-h-[44px] shrink-0 touch-manipulation items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-canvas/80 hover:text-ink sm:min-h-0"
            }
          >
            <Icon
              className={active ? "h-4 w-4 text-ocean" : "h-4 w-4 opacity-70"}
              strokeWidth={1.75}
              aria-hidden
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
