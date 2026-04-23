import { giftPriorityLabel } from "@/components/gift-priority-label";
import { giftStatusLabel } from "@/components/gift-status-label";
import { couplePhotoForKey } from "@/lib/couple-photos";
import type { Gift } from "@/lib/types";
import { Calendar, Gift as GiftIcon, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function GiftImage({
  gift,
  locked,
}: {
  gift: Gift;
  locked: boolean;
}) {
  const accent = gift.accent_color ?? "#2a5578";
  const fallback = couplePhotoForKey(gift.id);

  if (locked) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-ocean-deep">
        <Image
          src={fallback}
          alt=""
          fill
          className="object-cover opacity-35 saturate-[0.65]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-paper/85 to-paper/95 p-4 text-center backdrop-blur-[2px]">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed shadow-inner"
            style={{ borderColor: accent, color: accent }}
          >
            <Lock className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          </span>
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <Calendar className="h-3.5 w-3.5 text-ocean" aria-hidden />
            Libera em {gift.release_month ?? "breve"}
          </p>
        </div>
      </div>
    );
  }

  if (gift.image_url) {
    return (
      // URLs externas (Magalu, etc.) — img evita lista infinita de domínios no next.config
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={gift.image_url}
        alt=""
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={fallback}
        alt=""
        fill
        className="object-cover object-[center_22%] transition duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/50 via-transparent to-terracotta/15" />
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1 text-[10px] font-medium text-muted shadow-sm ring-1 ring-border backdrop-blur-sm">
        <GiftIcon className="h-3 w-3 text-terracotta" aria-hidden />
        Sugestão visual
      </div>
    </div>
  );
}

export function PresentesGiftCard({
  gift,
  locked,
}: {
  gift: Gift;
  locked: boolean;
}) {
  const accent = gift.accent_color ?? "#2a5578";

  return (
    <Link
      href={`/presentes/${gift.id}`}
      className="group flex h-full touch-manipulation flex-col overflow-hidden rounded-2xl bg-paper shadow-md ring-1 ring-border transition duration-300 active:scale-[0.99] sm:hover:-translate-y-1 sm:hover:shadow-xl sm:hover:ring-ocean/25"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-canvas"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}22` }}
      >
        <GiftImage gift={gift} locked={locked} />
        {!locked && gift.priority === "essential" ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-paper shadow-md">
            Urgente
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span
            className="rounded-full px-2.5 py-0.5 font-semibold text-paper shadow-sm"
            style={{ backgroundColor: accent }}
          >
            {giftPriorityLabel(gift.priority)}
          </span>
          <span className="rounded-full bg-canvas px-2.5 py-0.5 font-medium text-muted ring-1 ring-border">
            {giftStatusLabel(gift.status)}
          </span>
        </div>
        <h2 className="font-display text-lg font-medium leading-snug tracking-tight text-ink">
          {gift.title}
        </h2>
        {gift.estimated_price != null ? (
          <p className="mt-auto text-sm font-medium text-ocean">
            {new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(Number(gift.estimated_price))}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
