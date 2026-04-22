import { Heart, Settings, Users } from "lucide-react";
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="admin-page-title">Olá, noivos</h1>
        <p className="admin-page-sub">
          Gerem convites personalizados, o catálogo de presentes e as liberações
          ao longo dos meses — tudo alinhado com o vosso site.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/convidados"
          className="group admin-card relative overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-28px_rgba(45,90,117,0.35)]"
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.12] transition group-hover:opacity-[0.18]"
            style={{
              background: "radial-gradient(circle, var(--color-ocean) 0%, transparent 70%)",
            }}
          />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
            <Users className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Convidados
          </p>
          <h2 className="mt-3 font-display text-xl font-medium text-ink">
            Lista e convites
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Cada convidado recebe um link único com o nome dele na página de
            convite.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ocean-deep decoration-ocean/30 underline-offset-4 group-hover:underline">
            Abrir secção
            <span aria-hidden>→</span>
          </span>
        </Link>

        <Link
          href="/admin/presentes"
          className="group admin-card relative overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-28px_rgba(180,83,47,0.25)]"
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-[0.14] transition group-hover:opacity-[0.2]"
            style={{
              background:
                "radial-gradient(circle, var(--color-terracotta) 0%, transparent 72%)",
            }}
          />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-terracotta">
            <Heart className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Catálogo
          </p>
          <h2 className="mt-3 font-display text-xl font-medium text-ink">
            Presentes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Imagens, loja, preço, cor de destaque e mês de liberação na lista
            pública.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-terracotta decoration-terracotta/30 underline-offset-4 group-hover:underline">
            Abrir secção
            <span aria-hidden>→</span>
          </span>
        </Link>

        <Link
          href="/admin/definicoes"
          className="group admin-card relative overflow-hidden sm:col-span-2"
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <Settings className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Sistema
          </p>
          <h2 className="mt-3 font-display text-xl font-medium text-ink">
            Definições e automações
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            SMTP para emails de convite, cron na Netlify para expirar reservas e
            notas de configuração.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ocean underline decoration-ocean/25 underline-offset-4 group-hover:decoration-ocean">
            Ver definições
            <span aria-hidden>→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
