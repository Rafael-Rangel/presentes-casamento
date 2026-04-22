import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@/lib/brand";
import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const sp = await searchParams;
  const next =
    typeof sp.redirect === "string" && sp.redirect.startsWith("/admin")
      ? sp.redirect
      : "/admin";

  return (
    <main className="admin-login-backdrop mx-auto flex min-h-[72vh] w-full max-w-md flex-col justify-center px-4 py-16">
      <div className="admin-card relative overflow-hidden border-ocean/15 shadow-[0_24px_64px_-32px_rgba(26,61,82,0.35)] ring-1 ring-ocean/10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--color-terracotta-soft) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-border/80">
              <Image
                src={BRAND_LOGO_SRC}
                alt={BRAND_LOGO_ALT}
                width={44}
                height={44}
                className="object-cover"
                priority
              />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ocean">
                Acesso reservado
              </p>
              <h1 className="font-display text-2xl font-medium tracking-tight text-ink">
                Área dos noivos
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Introduz a senha do painel. Opcionalmente marca &quot;Lembrar neste
            aparelho&quot; para não voltares a pedir durante uns dias.
          </p>
          <AdminLoginForm redirectTo={next} />
          <p className="mt-8 border-t border-border/70 pt-5 text-center text-xs text-muted">
            <Link
              href="/presentes"
              className="font-semibold text-ocean underline decoration-ocean/30 underline-offset-2 transition hover:decoration-ocean"
            >
              Voltar aos presentes
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
