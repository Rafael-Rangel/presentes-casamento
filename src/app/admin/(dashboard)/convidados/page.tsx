import { sendGuestInviteFormAction } from "@/app/actions/invite-email";
import { getSiteUrl } from "@/lib/site-url";
import { createServiceClientOrNull } from "@/lib/supabase/service";
import type { Guest } from "@/lib/types";
import { Mail } from "lucide-react";
import { DeleteGuestForm } from "./delete-guest-form";
import { GuestCreateForm } from "./guest-form";
import { CopyRowLink } from "./copy-row-link";

export default async function AdminConvidadosPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>;
}) {
  const sp = await searchParams;
  const siteUrl = await getSiteUrl();
  const supabase = createServiceClientOrNull();
  const { data, error } = supabase
    ? await supabase
        .from("guests")
        .select("*")
        .order("created_at", { ascending: false })
    : { data: null, error: null };

  const guests = (data ?? []) as Guest[];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="admin-page-title">Convidados</h1>
        <p className="admin-page-sub">
          Cada pessoa tem um convite com o nome dela. O link da lista de
          presentes público é o mesmo para todos.
        </p>
      </header>

      {sp.flash ? (
        <p
          role="status"
          className="rounded-2xl border border-sand/60 bg-gradient-to-r from-paper to-canvas/60 px-4 py-3 text-sm text-ink shadow-sm"
        >
          {decodeURIComponent(sp.flash)}
        </p>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-terracotta/30 bg-paper/95 px-4 py-3 text-sm text-ink shadow-sm"
        >
          <p className="font-medium text-terracotta">Erro ao carregar convidados</p>
          <p className="mt-2 text-muted">
            {error.message} — no Supabase, abre o <strong>SQL Editor</strong> e
            executa{" "}
            <code className="rounded-md bg-canvas px-1.5 py-0.5 font-mono text-xs text-ocean-deep">
              supabase/sql_editor_add_guests.sql
            </code>{" "}
            (ou a migração{" "}
            <code className="rounded-md bg-canvas px-1.5 py-0.5 font-mono text-xs text-ocean-deep">
              20260223120000_guests_gift_color.sql
            </code>
            ). Confirma também{" "}
            <code className="rounded-md bg-canvas px-1.5 py-0.5 font-mono text-xs">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            no <code className="font-mono text-xs">.env.local</code>.
          </p>
        </div>
      ) : null}

      <GuestCreateForm siteUrl={siteUrl} disabled={!supabase} />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Link</th>
              <th>Email</th>
              <th className="w-[200px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id}>
                <td className="font-medium">{g.display_name}</td>
                <td className="max-w-[220px]">
                  <code className="break-all rounded-lg bg-canvas/80 px-2 py-1 font-mono text-xs text-muted">
                    /convite/{g.slug}
                  </code>
                  <CopyRowLink url={`${siteUrl}/convite/${g.slug}`} />
                </td>
                <td className="text-muted">{g.email ?? "—"}</td>
                <td className="space-y-2">
                  {g.email ? (
                    <form action={sendGuestInviteFormAction}>
                      <input type="hidden" name="guestId" value={g.id} />
                      <button
                        type="submit"
                        disabled={!supabase}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-ocean/25 bg-ocean/8 px-2.5 py-1.5 text-xs font-semibold text-ocean-deep transition hover:bg-ocean/15 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden />
                        Enviar convite
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs text-muted/80">Sem email</span>
                  )}
                  <DeleteGuestForm guestId={g.id} disabled={!supabase} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {guests.length === 0 && !error ? (
        <p className="rounded-2xl border border-dashed border-border bg-paper/50 px-4 py-8 text-center text-sm text-muted">
          Ainda não há convidados. Adiciona o primeiro com o formulário acima.
        </p>
      ) : null}
    </div>
  );
}
