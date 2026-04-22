import { giftStatusLabel } from "@/components/gift-status-label";
import { createClient } from "@/lib/supabase/server";
import type { Gift, ReservationRow } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";

type ReservationWithGift = ReservationRow & {
  gifts: Pick<Gift, "title" | "status"> | null;
};

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/conta");
  }

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*, gifts(title, status)")
    .order("created_at", { ascending: false });

  const rows = (reservations ?? []) as ReservationWithGift[];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Minhas reservas
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Estado das tuas reservas e datas de expiração (48h após reserva,
          salvo alteração manual no Supabase).
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error.message}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Ainda não tens reservas.{" "}
          <Link href="/presentes" className="font-medium underline">
            Ver presentes
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {r.gifts?.title ?? "Presente"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Presente:{" "}
                    {r.gifts?.status
                      ? giftStatusLabel(r.gifts.status as Gift["status"])
                      : "—"}
                    {" · "}Reserva: {r.status}
                  </p>
                </div>
                <Link
                  href={`/presentes/${r.gift_id}`}
                  className="text-xs font-medium text-zinc-900 underline dark:text-zinc-100"
                >
                  Ver presente
                </Link>
              </div>
              {r.message ? (
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {r.message}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-zinc-500">
                Expira: {new Date(r.expires_at).toLocaleString("pt-PT")}
                {r.is_surprise ? " · Surpresa" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
