import { logoutAdmin } from "@/app/actions/admin-auth";
import { AdminServiceRoleBanner } from "@/components/admin-service-role-banner";
import { AdminSidebarNav } from "@/components/admin-sidebar-nav";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:gap-8 sm:px-6 sm:py-8 lg:flex-row lg:gap-10">
      <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-56 lg:self-start">
        <div className="admin-sidebar-panel">
          <p className="font-display text-lg font-medium tracking-tight text-ink">
            Painel
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            Noivos — convites e presentes
          </p>
          <div className="mt-4 border-t border-border/60 pt-4">
            <AdminSidebarNav />
          </div>
          <form action={logoutAdmin} className="mt-5 border-t border-border/60 pt-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-canvas/50 px-3 py-2 text-xs font-semibold text-muted transition hover:border-terracotta/35 hover:bg-canvas hover:text-ink"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Sair do painel
            </button>
          </form>
          <Link
            href="/presentes"
            className="mt-3 flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium text-ocean transition hover:text-ocean-deep"
          >
            ← Ver site público
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <AdminServiceRoleBanner />
        {children}
      </div>
    </div>
  );
}
