"use client";

import { createGuest, type GuestActionState } from "@/app/actions/guests";
import { UserPlus } from "lucide-react";
import { useActionState } from "react";

const initial: GuestActionState = { ok: false };

export function GuestCreateForm({
  siteUrl,
  disabled = false,
}: {
  siteUrl: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(createGuest, initial);

  return (
    <div className="admin-card">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
          <UserPlus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-medium text-ink">
            Novo convidado
          </h2>
          <p className="mt-1 text-sm text-muted">
            Gera-se automaticamente um link único{" "}
            <code className="rounded bg-canvas px-1 font-mono text-xs">
              /convite/…
            </code>
          </p>
        </div>
      </div>

      {disabled ? (
        <p className="mt-4 rounded-xl border border-border bg-canvas/40 px-3 py-2 text-sm text-muted">
          Configura o Supabase (aviso no topo) para adicionar convidados.
        </p>
      ) : null}

      {state.ok && state.slug ? (
        <p className="mt-4 rounded-xl border border-ocean/20 bg-ocean/5 px-3 py-2.5 text-sm text-ocean-deep">
          Criado! Link:{" "}
          <strong className="break-all font-mono text-xs">
            {siteUrl}/convite/{state.slug}
          </strong>
        </p>
      ) : null}
      {state.error ? (
        <p className="mt-4 text-sm font-medium text-terracotta">{state.error}</p>
      ) : null}

      <form action={formAction} className="mt-5 space-y-4">
        <label className="admin-label">
          Nome no convite
          <input
            required
            name="displayName"
            disabled={disabled}
            className="admin-input"
            placeholder="Ex.: Maria Silva"
          />
        </label>
        <label className="admin-label">
          Email (opcional — para enviar convite)
          <input
            type="email"
            name="email"
            disabled={disabled}
            className="admin-input"
          />
        </label>
        <label className="admin-label">
          Telefone (opcional)
          <input name="phone" disabled={disabled} className="admin-input" />
        </label>
        <label className="admin-label">
          Notas (só para vocês, opcional)
          <textarea
            name="notes"
            rows={2}
            disabled={disabled}
            className="admin-input min-h-[4.5rem] resize-y"
          />
        </label>
        <button
          type="submit"
          disabled={pending || disabled}
          className="admin-btn-primary w-full sm:w-auto"
        >
          {pending ? "A criar…" : "Adicionar convidado"}
        </button>
      </form>
    </div>
  );
}
