import { CoupleMosaic } from "@/components/couple-mosaic";
import { PresentesGiftCard } from "@/components/presentes-gift-card";
import { SectionHeading } from "@/components/section-heading";
import { createClient } from "@/lib/supabase/server";
import { currentMonthKey, isGiftUnlocked } from "@/lib/gift-visibility";
import { coupleHeroPhotos } from "@/lib/couple-photos";
import type { Gift } from "@/lib/types";
import { Calendar, Flame, Gift as GiftIcon, Lock, Search } from "lucide-react";
import Link from "next/link";

const weddingDate =
  process.env.NEXT_PUBLIC_WEDDING_DATE ?? "12 de dezembro de 2026";

export default async function PresentesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const cat = sp.cat?.trim() ?? "";
  const month = currentMonthKey();
  const hero = coupleHeroPhotos(3);

  const supabase = await createClient();
  const { data: giftsRaw, error } = await supabase
    .from("gifts")
    .select("*")
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  const gifts = (giftsRaw ?? []) as Gift[];

  const filtered = gifts.filter((g) => {
    const hay = `${g.title} ${g.description} ${g.category}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (cat && g.category !== cat) return false;
    return true;
  });

  const unlocked = filtered.filter((g) =>
    isGiftUnlocked(g.release_month, g.status),
  );
  const locked = filtered.filter(
    (g) => !isGiftUnlocked(g.release_month, g.status),
  );

  const urgent = unlocked.filter(
    (g) => g.priority === "essential" || g.priority === "high",
  );
  const thisMonth = unlocked.filter(
    (g) => !g.release_month?.trim() || g.release_month === month,
  );
  const otherUnlocked = unlocked.filter(
    (g) => !urgent.includes(g) && !thisMonth.includes(g),
  );

  const categories = Array.from(
    new Set(gifts.map((g) => g.category).filter(Boolean)),
  ).sort();

  return (
    <main className="relative flex-1">
      <div className="border-b border-border/70 bg-paper/60">
        <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-12 md:py-16">
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
                <GiftIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Lista de presentes
              </p>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:mt-4 sm:text-4xl md:text-5xl">
                {weddingDate}
              </h1>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted sm:mt-5 sm:text-base">
                Fotos nossas, referências reais de loja e ideias que vão
                aparecendo mês a mês — começamos pelo essencial e vamos
                abrindo o resto como um jogo em equipa.
              </p>
              <p className="mt-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-canvas px-3 py-2 text-xs font-medium text-ocean-deep ring-1 ring-border sm:px-4 sm:text-sm">
                <Calendar className="h-4 w-4" aria-hidden />
                Calendário ativo:{" "}
                <span className="font-semibold text-ink">{month}</span>
              </p>
            </div>
            <CoupleMosaic paths={hero} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-3 py-10 sm:space-y-16 sm:px-6 sm:py-14">
        <form
          className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-paper/90 p-3 shadow-sm ring-1 ring-border/60 sm:gap-4 sm:p-4 md:flex-row md:items-end md:p-5"
          method="get"
        >
          <label className="flex flex-1 flex-col gap-2 text-sm">
            <span className="flex items-center gap-2 font-medium text-ink">
              <Search className="h-4 w-4 text-ocean" strokeWidth={1.75} aria-hidden />
              Pesquisar
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Fogão, cama, air fryer…"
              className="min-h-[2.75rem] w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-base text-ink shadow-inner outline-none ring-ocean/30 transition focus:border-ocean/40 focus:ring-2 sm:px-4 sm:text-sm"
            />
          </label>
          <label className="flex w-full flex-col gap-2 text-sm md:max-w-[220px]">
            <span className="font-medium text-ink">Categoria</span>
            <select
              name="cat"
              defaultValue={cat}
              className="min-h-[2.75rem] w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-base text-ink shadow-inner outline-none focus:ring-2 focus:ring-ocean/25 sm:px-4 sm:text-sm"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex min-h-[2.75rem] w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ocean-deep to-ocean px-6 py-3 text-sm font-semibold text-paper shadow-md transition hover:brightness-110 md:w-auto md:py-2.5"
          >
            <Search className="h-4 w-4 opacity-90" aria-hidden />
            Aplicar
          </button>
        </form>

        {error ? (
          <p className="rounded-2xl border border-terracotta/30 bg-terracotta/10 px-5 py-4 text-sm text-ink">
            Não foi possível carregar os presentes. Confirma a ligação ao
            Supabase.
          </p>
        ) : null}

        {urgent.length > 0 ? (
          <section className="space-y-8">
            <SectionHeading
              icon={Flame}
              eyebrow="Primeiro nível"
              title="Prioridade e urgência"
              description="O que mais precisamos de organizar primeiro — reserva com carinho."
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {urgent.map((g) => (
                <li key={g.id}>
                  <PresentesGiftCard gift={g} locked={false} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {thisMonth.length > 0 ? (
          <section className="space-y-8">
            <SectionHeading
              icon={Calendar}
              eyebrow="Neste capítulo"
              title="Deste mês no radar"
              description="Sugestões alinhadas com o mês atual ou sem data fechada."
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {thisMonth
                .filter((g) => !urgent.includes(g))
                .map((g) => (
                  <li key={g.id}>
                    <PresentesGiftCard gift={g} locked={false} />
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        {otherUnlocked.length > 0 ? (
          <section className="space-y-8">
            <SectionHeading
              icon={GiftIcon}
              eyebrow="Mais ideias"
              title="Outros presentes"
              description="Já podes ver e combinar — ajudam a completar a nossa casa."
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {otherUnlocked.map((g) => (
                <li key={g.id}>
                  <PresentesGiftCard gift={g} locked={false} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {locked.length > 0 ? (
          <section className="space-y-8">
            <SectionHeading
              icon={Lock}
              eyebrow="Em contagem decrescente"
              title="Próximas surpresas"
              description="Ainda ‘no forno’ até ao mês indicado — ficam aqui para criar expectativa."
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {locked.map((g) => (
                <li key={g.id}>
                  <PresentesGiftCard gift={g} locked />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!error &&
        urgent.length === 0 &&
        thisMonth.length === 0 &&
        otherUnlocked.length === 0 &&
        locked.length === 0 ? (
          <p className="text-center font-medium text-muted">
            Nenhum presente com estes filtros.{" "}
            <Link href="/presentes" className="text-ocean underline">
              Limpar
            </Link>
          </p>
        ) : null}
      </div>
    </main>
  );
}
