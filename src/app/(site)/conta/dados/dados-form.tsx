"use client";

import { updateGuestProfile, type ProfileActionState } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import Link from "next/link";

const initial: ProfileActionState = { ok: false, error: undefined };

export function ContaDadosForm({
  defaultFullName,
  defaultPhone,
  defaultRelationship,
  defaultMarketingOptIn,
  nextHref,
}: {
  defaultFullName: string;
  defaultPhone: string;
  defaultRelationship: string;
  defaultMarketingOptIn: boolean;
  nextHref: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateGuestProfile, initial);

  useEffect(() => {
    if (state.ok) {
      router.push(nextHref);
      router.refresh();
    }
  }, [state.ok, nextHref, router]);

  return (
    <form action={formAction} className="space-y-5">
      {!state.ok && state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="font-medium text-ink">Nome completo</span>
        <input
          name="fullName"
          type="text"
          required
          autoComplete="name"
          defaultValue={defaultFullName}
          className="mt-2 min-h-[2.75rem] w-full rounded-xl border border-border bg-paper px-3 py-2 text-base text-ink shadow-inner outline-none focus:ring-2 focus:ring-ocean/25 sm:text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-ink">Telefone</span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue={defaultPhone}
          placeholder="+351 …"
          className="mt-2 min-h-[2.75rem] w-full rounded-xl border border-border bg-paper px-3 py-2 text-base text-ink shadow-inner outline-none focus:ring-2 focus:ring-ocean/25 sm:text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-ink">Como conheces os noivos?</span>
        <textarea
          name="relationshipNote"
          rows={3}
          required
          defaultValue={defaultRelationship}
          placeholder="Ex.: trabalho, família da noiva, vizinho…"
          className="mt-2 min-h-[5rem] w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-base text-ink shadow-inner outline-none focus:ring-2 focus:ring-ocean/25 sm:text-sm"
        />
      </label>
      <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="marketingOptIn"
          defaultChecked={defaultMarketingOptIn}
          className="mt-1 size-5 shrink-0 rounded border-border"
        />
        <span>
          Quero receber lembretes ocasionais sobre a lista de presentes (podes cancelar a
          qualquer momento).
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-[3rem] w-full rounded-xl bg-gradient-to-r from-ocean-deep to-ocean py-3 text-base font-semibold text-paper shadow-md transition hover:brightness-110 disabled:opacity-60 sm:text-sm"
      >
        {pending ? "A guardar…" : "Guardar dados"}
      </button>
      <p className="text-center text-sm text-muted">
        <Link href={nextHref} className="underline">
          Completar mais tarde
        </Link>
      </p>
    </form>
  );
}
