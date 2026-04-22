"use client";

import { deleteGiftForm, type GiftActionState } from "@/app/actions/gifts";
import { useActionState } from "react";

const initial: GiftActionState = { ok: false };

export function DeleteGiftForm({ giftId }: { giftId: string }) {
  const [state, formAction, pending] = useActionState(deleteGiftForm, initial);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="giftId" value={giftId} />
      {state.error ? (
        <p className="mb-1 text-xs font-medium text-terracotta">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="admin-btn-danger disabled:opacity-45"
      >
        {pending ? "A apagar…" : "Apagar"}
      </button>
    </form>
  );
}
