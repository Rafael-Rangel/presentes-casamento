import { getSiteUrl } from "@/lib/site-url";
import { couplePhotoForKey } from "@/lib/couple-photos";
import { createServiceClientOrNull } from "@/lib/supabase/service";
import type { Guest } from "@/lib/types";
import { Gift, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyInviteUrl } from "./copy-invite-url";

const weddingDate =
  process.env.NEXT_PUBLIC_WEDDING_DATE ?? "12 de dezembro de 2026";

export default async function ConvitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceClientOrNull();
  if (!supabase) {
    return (
      <main className="mx-auto max-w-md flex-1 px-4 py-24 text-center text-sm text-muted">
        <p className="text-ink">
          O convite não está disponível neste momento (configuração do servidor
          incompleta).
        </p>
      </main>
    );
  }
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const guest = data as Guest;
  const siteUrl = await getSiteUrl();
  const inviteUrl = `${siteUrl}/convite/${guest.slug}`;
  const bg = couplePhotoForKey(guest.id);

  return (
    <main className="relative isolate min-h-[88vh] overflow-hidden text-paper">
      <div className="absolute inset-0">
        <Image
          src={bg}
          alt=""
          fill
          className="object-cover object-center saturate-[0.85]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/88 via-ocean-deep/82 to-clay/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(196,165,116,0.22),transparent_50%)]" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col gap-10 px-4 py-20 sm:py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-sand">
          Convite personalizado
        </p>
        <h1 className="text-center font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Olá,{" "}
          <span className="bg-gradient-to-r from-sand via-paper to-wave bg-clip-text text-transparent">
            {guest.display_name}
          </span>
        </h1>
        <p className="text-center text-lg leading-relaxed text-paper/90">
          Estamos muito felizes por celebrares connosco —{" "}
          <span className="font-semibold text-sand">{weddingDate}</span>.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/presentes"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sand to-terracotta-soft px-9 py-3.5 text-sm font-bold text-ocean-deep shadow-lg transition hover:brightness-105"
          >
            <Gift className="h-4 w-4" strokeWidth={2} aria-hidden />
            Ver lista de presentes
          </Link>
        </div>

        <div className="rounded-2xl border border-paper/15 bg-paper/10 p-6 shadow-xl backdrop-blur-md">
          <p className="flex items-center justify-center gap-2 text-center text-sm text-paper/90">
            <Heart className="h-4 w-4 fill-sand/40 text-sand" aria-hidden />
            Guarda o teu link — é só teu e leva-te sempre a esta página.
          </p>
          <CopyInviteUrl url={inviteUrl} />
        </div>

        {guest.notes ? (
          <p className="whitespace-pre-wrap rounded-xl border border-paper/10 bg-ocean-deep/30 px-4 py-3 text-center text-sm leading-relaxed text-paper/85 backdrop-blur-sm">
            {guest.notes}
          </p>
        ) : null}
      </div>
    </main>
  );
}
