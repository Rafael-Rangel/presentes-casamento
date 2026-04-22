"use client";

import { deleteGuestForm, type GuestActionState } from "@/app/actions/guests";
import { Trash2 } from "lucide-react";
import { useActionState } from "react";

const initial: GuestActionState = { ok: false };

export function DeleteGuestForm({
  guestId,
  disabled = false,
}: {
  guestId: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(deleteGuestForm, initial);
  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="guestId" value={guestId} />
      {state.error ? (
        <p className="mb-1 text-xs font-medium text-terracotta">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending || disabled}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-terracotta transition hover:bg-terracotta/10 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        {pending ? "…" : "Remover"}
      </button>
    </form>
  );
}
