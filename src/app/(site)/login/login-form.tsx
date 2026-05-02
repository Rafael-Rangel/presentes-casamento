"use client";

import { signInWithMagicLink, type AuthActionState } from "@/app/actions/auth";
import { Loader2, Sparkles } from "lucide-react";
import { useActionState } from "react";

const initial: AuthActionState = { ok: false };

export function LoginForm({ defaultNext }: { defaultNext: string }) {
  const [state, formAction, pending] = useActionState(
    signInWithMagicLink,
    initial,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={defaultNext} />
      <label className="block">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="mt-2 min-h-[3rem] w-full rounded-xl border border-border bg-paper px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgba(42,36,29,0.05)] outline-none transition placeholder:text-muted/55 focus:border-ocean/45 focus:ring-2 focus:ring-ocean/15 sm:text-sm"
          placeholder="nome@exemplo.com"
        />
      </label>
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-sm text-ink"
        >
          {state.error}
        </p>
      ) : null}
      {state.ok && state.message ? (
        <p className="rounded-xl border border-ocean/30 bg-ocean/8 px-3 py-2 text-sm leading-relaxed text-ink">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-[3rem] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-ocean-deep py-3.5 text-base font-semibold text-paper shadow-[0_2px_0_rgba(26,61,82,0.35)] transition hover:bg-ocean disabled:opacity-55 sm:text-sm"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            A enviar…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 opacity-90" strokeWidth={2} aria-hidden />
            Enviar link mágico
          </>
        )}
      </button>
    </form>
  );
}
