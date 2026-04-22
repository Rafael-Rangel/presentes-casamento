"use client";

import { loginAdmin, type AdminLoginState } from "@/app/actions/admin-auth";
import { useActionState } from "react";

const initial: AdminLoginState = { ok: false };

export function AdminLoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      <label className="admin-label">
        Senha
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="admin-input mt-2"
        />
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
        <input
          type="checkbox"
          name="remember"
          className="size-4 rounded border-border text-ocean focus:ring-ocean/30"
        />
        Lembrar neste aparelho (90 dias)
      </label>
      {state.error ? (
        <p className="text-sm font-medium text-terracotta">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary mt-1 w-full py-3"
      >
        {pending ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
