import { CoupleMosaic } from "@/components/couple-mosaic";
import { coupleHeroPhotos } from "@/lib/couple-photos";
import { Gift, Heart, Mail } from "lucide-react";
import Link from "next/link";

const weddingDate =
  process.env.NEXT_PUBLIC_WEDDING_DATE ?? "12 de dezembro de 2026";

export default function Home() {
  const hero = coupleHeroPhotos(3);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-sky/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-terracotta/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <CoupleMosaic paths={hero} className="lg:max-w-xl" />
          </div>

          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <Heart className="h-3.5 w-3.5 fill-terracotta/30" aria-hidden />
              Com amor
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              O nosso{" "}
              <span className="bg-gradient-to-r from-ocean-deep to-ocean bg-clip-text text-transparent">
                casamento
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              <span className="font-semibold text-ink">{weddingDate}</span>
              <span className="text-muted">
                {" "}
                — convites com o teu nome, uma lista de presentes a crescer ao
                longo dos meses, e o nosso cantinho para vos receber.
              </span>
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link
                href="/presentes"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-paper/90 p-5 shadow-sm ring-1 ring-border/60 transition hover:-translate-y-0.5 hover:border-ocean/30 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean ring-1 ring-ocean/15">
                  <Gift className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-lg font-medium text-ink">
                    Lista de presentes
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted">
                    Fotos reais, referências de loja e surpresas por mês.
                  </span>
                </span>
              </Link>

              <Link
                href="/admin/login"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-gradient-to-br from-paper to-canvas/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-terracotta/35 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta ring-1 ring-terracotta/20">
                  <Heart className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-lg font-medium text-ink">
                    Área dos noivos
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted">
                    Convidados, presentes e definições do site.
                  </span>
                </span>
              </Link>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-ocean/25 bg-ocean/5 px-4 py-3 text-sm text-muted">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden />
              <p>
                Cada convidado recebe um link único{" "}
                <code className="rounded bg-paper px-1.5 py-0.5 text-xs text-ink ring-1 ring-border">
                  /convite/…
                </code>{" "}
                criado no painel — guarda o teu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
