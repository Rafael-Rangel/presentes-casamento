import { giftPriorityLabel } from "@/components/gift-priority-label";
import { giftStatusLabel } from "@/components/gift-status-label";
import { createClient } from "@/lib/supabase/server";
import { couplePhotoForKey } from "@/lib/couple-photos";
import type { Gift } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReserveGiftForm } from "./reserve-form";

export default async function PresenteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: giftRaw, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !giftRaw) {
    notFound();
  }

  const gift = giftRaw as Gift;
  const accent = gift.accent_color ?? "#2d5a75";
  const fallback = couplePhotoForKey(gift.id);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const canReserve = gift.status === "available" && Boolean(user);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-3 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:gap-10 sm:px-6 sm:py-10">
      <Link
        href="/presentes"
        className="inline-flex min-h-[44px] w-fit touch-manipulation items-center gap-2 py-1 text-sm font-medium text-ocean hover:text-ocean-deep"
      >
        <span aria-hidden>←</span> Voltar à lista
      </Link>

      <article className="space-y-8">
        <div
          className="overflow-hidden rounded-2xl border border-border border-t-[5px] bg-paper shadow-md ring-1 ring-border/60"
          style={{ borderTopColor: accent }}
        >
          {gift.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gift.image_url}
              alt=""
              className="max-h-[min(55vh,440px)] w-full object-cover sm:max-h-[440px]"
            />
          ) : (
            <div className="relative aspect-[16/10] w-full max-h-[min(55vh,440px)] sm:max-h-[440px]">
              <Image
                src={fallback}
                alt=""
                fill
                className="object-cover object-[center_22%]"
                sizes="(max-width: 768px) 100vw, 42rem"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-deep/45 to-transparent" />
            </div>
          )}
        </div>

        <header className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-canvas px-2.5 py-1 font-semibold text-ink ring-1 ring-border">
              {giftStatusLabel(gift.status)}
            </span>
            <span
              className="rounded-full px-2.5 py-1 font-semibold text-paper shadow-sm"
              style={{ backgroundColor: accent }}
            >
              {giftPriorityLabel(gift.priority)}
            </span>
            {gift.category ? (
              <span className="rounded-full bg-paper px-2.5 py-1 text-muted ring-1 ring-border">
                {gift.category}
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl md:text-4xl">
            {gift.title}
          </h1>
          {gift.estimated_price != null ? (
            <p className="text-lg font-medium text-ocean">
              Referência:{" "}
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(Number(gift.estimated_price))}
            </p>
          ) : null}
        </header>

        {gift.description ? (
          <p className="whitespace-pre-wrap leading-relaxed text-muted">
            {gift.description}
          </p>
        ) : null}

        {gift.store_url ? (
          <a
            href={gift.store_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-ocean/25 bg-ocean/5 px-4 py-2.5 text-sm font-semibold text-ocean-deep transition hover:border-ocean/40 hover:bg-ocean/10 sm:w-fit sm:py-2"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Abrir produto de referência
          </a>
        ) : null}
      </article>

      <section className="space-y-4">
        {!user ? (
          <p className="rounded-xl border border-border bg-canvas/80 px-4 py-3 text-sm text-muted">
            <Link href="/login" className="font-semibold text-ocean underline">
              Inicia sessão
            </Link>{" "}
            para reservares este presente.
          </p>
        ) : null}
        <ReserveGiftForm giftId={gift.id} canReserve={canReserve} />
      </section>
    </main>
  );
}
