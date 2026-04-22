"use client";

import { signInWithMagicLink, type AuthActionState } from "@/app/actions/auth";
import { useActionState } from "react";

const initial: AuthActionState = { ok: false };

export function LoginForm({ defaultNext }: { defaultNext: string }) {
  const [state, formAction, pending] = useActionState(
    signInWithMagicLink,
    initial,
  );

  return (
    <form action={formAction} className="mx-auto max-w-md space-y-4">
      <input type="hidden" name="next" value={defaultNext} />
      <label className="block text-sm">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          Email
        </span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="nome@exemplo.com"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
      {state.ok && state.message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "A enviar…" : "Enviar link mágico"}
      </button>
    </form>
  );
}
