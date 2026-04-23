"use client";

import { reserveGift, type ActionState } from "@/app/actions/reservations";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initial: ActionState = { ok: false };

export function ReserveGiftForm({
  giftId,
  canReserve,
}: {
  giftId: string;
  canReserve: boolean;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(reserveGift, initial);

  useEffect(() => {
    if (state.ok) {
      router.push("/conta");
      router.refresh();
    }
  }, [state.ok, router]);

  if (!canReserve) {
    return (
      <p className="rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-muted">
        Este presente não está disponível para reserva.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-border bg-paper/95 p-4 shadow-sm ring-1 ring-border/70 sm:p-6"
    >
      <input type="hidden" name="giftId" value={giftId} />
      <h2 className="font-display text-lg font-medium text-ink sm:text-xl">Reservar</h2>
      {state.error ? (
        <p className="text-sm font-medium text-terracotta">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="text-sm font-medium text-ocean">
          Reserva criada. A redirecionar…
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="font-medium text-ink">Mensagem (opcional)</span>
        <textarea
          name="message"
          rows={3}
          className="mt-2 min-h-[5.5rem] w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-base text-ink shadow-inner outline-none focus:ring-2 focus:ring-ocean/25 sm:text-sm"
          placeholder="Um recado para os noivos…"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-ink">Previsão de compra (opcional)</span>
        <input
          type="date"
          name="purchaseEstimate"
          lang="pt-BR"
          className="mt-2 min-h-[2.75rem] w-full rounded-xl border border-border bg-paper px-3 py-2 text-base text-ink shadow-inner outline-none focus:ring-2 focus:ring-ocean/25 sm:text-sm"
        />
        <span className="mt-1 block text-xs text-muted">
          Data no calendário (dia/mês/ano). Gravada como data civil, sem mudar o dia por fuso.
        </span>
      </label>
      <label className="flex min-h-[44px] cursor-pointer touch-manipulation items-center gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="isSurprise"
          className="size-5 shrink-0 rounded border-border"
        />
        Reserva surpresa
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-[3rem] w-full touch-manipulation rounded-xl bg-gradient-to-r from-ocean-deep to-ocean py-3 text-base font-semibold text-paper shadow-md transition hover:brightness-110 disabled:opacity-60 sm:text-sm"
      >
        {pending ? "A reservar…" : "Confirmar reserva"}
      </button>
    </form>
  );
}
