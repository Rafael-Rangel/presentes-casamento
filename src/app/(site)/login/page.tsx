import Link from "next/link";
import { LoginForm } from "./login-form";
import { Heart, Mail } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const defaultNext =
    typeof sp.redirect === "string" && sp.redirect.startsWith("/")
      ? sp.redirect
      : "/";

  return (
    <main className="relative flex flex-1 flex-col">
      <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-sky/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-32 h-64 w-64 rounded-full bg-terracotta/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-3 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-16">
        <div className="rounded-2xl border border-border/90 bg-paper/95 p-6 shadow-[0_1px_0_rgba(42,36,29,0.06),0_22px_56px_-28px_rgba(26,61,82,0.28)] backdrop-blur-md sm:p-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            <Heart className="h-3.5 w-3.5 fill-terracotta/25" aria-hidden />
            Convite
          </p>
          <h1 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Iniciar sessão
          </h1>
          <p className="mt-3 flex gap-2 text-sm leading-relaxed text-muted">
            <Mail
              className="mt-0.5 h-4 w-4 shrink-0 text-ocean"
              strokeWidth={1.75}
              aria-hidden
            />
            <span>
              Recebes um link por email (magic link). Sem palavra-passe.
            </span>
          </p>

          {sp.error === "auth" ? (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-terracotta/35 bg-terracotta/10 px-4 py-3 text-sm leading-snug text-ink"
            >
              Falha na autenticação. Tenta pedir um novo link.
            </p>
          ) : null}

          <div className={sp.error === "auth" ? "mt-6" : "mt-8"}>
            <LoginForm defaultNext={defaultNext} />
          </div>

          <p className="mt-8 border-t border-border/70 pt-6 text-center text-sm text-muted">
            <Link
              href="/"
              className="font-medium text-ocean transition hover:text-ocean-deep"
            >
              ← Voltar à página inicial
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
