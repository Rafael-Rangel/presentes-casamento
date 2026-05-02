"use client";

import { loginAdmin, type AdminLoginState } from "@/app/actions/admin-auth";
import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

const initial: AdminLoginState = { ok: false };

export function AdminLoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAdmin, initial);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      <label className="admin-label">
        Senha
        <div className="relative mt-2">
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            className="admin-input w-full pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute end-2 top-1/2 z-10 flex size-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg text-muted transition hover:bg-paper/80 hover:text-ink"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
        <input
          type="checkbox"
          name="remember"
          className="size-4 rounded border-border text-ocean focus:ring-ocean/30"
        />
        Lembrar neste aparelho
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
