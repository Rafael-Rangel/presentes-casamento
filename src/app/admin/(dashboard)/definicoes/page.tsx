import { Bell, Mail, Server } from "lucide-react";
import Link from "next/link";

export default function AdminDefinicoesPage() {
  return (
    <div className="max-w-2xl space-y-6 break-words sm:space-y-8">
      <header>
        <h1 className="admin-page-title">Definições</h1>
        <p className="admin-page-sub">
          Variáveis no ficheiro <code className="rounded bg-canvas px-1 font-mono text-xs">.env.local</code>{" "}
          ou na Netlify — nunca commits com segredos.
        </p>
      </header>

      <section className="admin-card">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
            <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-lg font-medium text-ink">
              E-mail (SMTP)
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Podes usar Gmail com SMTP. Cria uma{" "}
              <strong className="text-ink">palavra-passe de app</strong> na conta
              Google (não uses a palavra-passe normal). Coloca em{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                SMTP_PASSWORD
              </code>{" "}
              só no servidor.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <code className="block break-all font-mono text-xs text-ocean-deep">
                  SMTP_HOST=smtp.gmail.com
                </code>
              </li>
              <li>
                <code className="block break-all font-mono text-xs text-ocean-deep">
                  SMTP_PORT=587
                </code>
              </li>
              <li>
                <code className="font-mono text-xs text-ocean-deep">SMTP_USER</code>{" "}
                /{" "}
                <code className="font-mono text-xs text-ocean-deep">
                  SMTP_PASSWORD
                </code>
              </li>
              <li>
                <code className="font-mono text-xs text-ocean-deep">EMAIL_FROM</code>
                ,{" "}
                <code className="font-mono text-xs text-ocean-deep">
                  EMAIL_FROM_NAME
                </code>
              </li>
            </ul>
            <p className="mt-4 rounded-xl border border-terracotta/25 bg-terracotta/5 px-3 py-2 text-xs leading-relaxed text-ink">
              Se expuseres a app password em público, revoga-a no Google e gera
              outra.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              <strong className="text-ink">Volume:</strong> Gmail gratuito limita envios diários;
              lembretes automáticos e convites em massa podem falhar ou bloquear a conta.
              Para muitos destinatários, usa um serviço tipo Resend ou SendGrid.
            </p>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
            <Server className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-lg font-medium text-ink">
              Reservas a expirar (cron na Netlify)
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              O ficheiro{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                netlify.toml
              </code>{" "}
              agenda a função{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                netlify/functions/expire-reservations.mjs
              </code>{" "}
              de hora em hora; ela chama{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                /api/cron/expire-reservations
              </code>{" "}
              com{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                CRON_SECRET
              </code>{" "}
              no header{" "}
              <code className="font-mono text-xs">Authorization: Bearer …</code>.
              Define <code className="font-mono text-xs">CRON_SECRET</code> nas
              variáveis de ambiente da Netlify (produção).
            </p>
            <p className="mt-3 text-sm text-muted">
              No Supabase, aplica a migração{" "}
              <code className="rounded bg-canvas px-1 font-mono text-[0.65rem]">
                20260223140000_expire_reservations.sql
              </code>{" "}
              (ou o <code className="font-mono text-xs">schema.sql</code> completo
              num projeto novo).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Lembretes da lista (opt-in): a função agendada{" "}
              <code className="rounded bg-canvas px-1 font-mono text-[0.65rem]">
                netlify/functions/gift-reminders.mjs
              </code>{" "}
              corre{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                @daily
              </code>{" "}
              e chama{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                /api/cron/gift-reminders
              </code>
              . Só envia a perfis com consentimento, sem reservas e no máximo uma vez
              por semana por pessoa.
            </p>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand/40 text-clay">
            <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-lg font-medium text-ink">
              Notificações no telemóvel (Web Push)
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Já integrado: service worker em{" "}
              <code className="rounded bg-canvas px-1 font-mono text-[0.65rem]">
                /sw.js
              </code>
              , envio com{" "}
              <code className="rounded bg-canvas px-1 font-mono text-xs">
                web-push
              </code>{" "}
              e subscrições na base de dados. Gera um par VAPID com{" "}
              <code className="rounded bg-canvas px-1 font-mono text-[0.65rem]">
                npx web-push generate-vapid-keys
              </code>{" "}
              e define nas variáveis de ambiente (Netlify /{" "}
              <code className="font-mono text-xs">.env.local</code>):
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li>
                <code className="font-mono text-xs text-ocean-deep">
                  NEXT_PUBLIC_VAPID_PUBLIC_KEY
                </code>{" "}
                — chave pública (browser)
              </li>
              <li>
                <code className="font-mono text-xs text-ocean-deep">
                  VAPID_PRIVATE_KEY
                </code>{" "}
                — só servidor; nunca{" "}
                <code className="font-mono text-xs">NEXT_PUBLIC_*</code>
              </li>
              <li className="text-xs">
                Opcional:{" "}
                <code className="font-mono text-[0.65rem]">VAPID_SUBJECT</code>{" "}
                (ex.{" "}
                <code className="font-mono text-[0.65rem]">
                  mailto:casamento@…
                </code>
                ); se omitires, usa <code className="font-mono text-[0.65rem]">EMAIL_FROM</code>.
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Os convidados activam em{" "}
              <Link
                href="/conta"
                className="font-medium text-ocean underline underline-offset-2"
              >
                Minhas reservas
              </Link>
              . Em produção é preciso{" "}
              <strong className="text-ink">HTTPS</strong>. No iPhone o Safari tem
              push web limitado (por vezes só com PWA no ecrã inicial).
            </p>
          </div>
        </div>
      </section>

      <p>
        <Link href="/admin" className="admin-back-link">
          ← Voltar ao painel
        </Link>
      </p>
    </div>
  );
}
