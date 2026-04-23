import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-5 px-3 py-16 pb-[max(3rem,env(safe-area-inset-bottom))] text-center sm:gap-6 sm:px-4 sm:py-24">
      <p className="font-display text-3xl font-medium text-ink sm:text-4xl">404</p>
      <div>
        <h1 className="text-lg font-semibold text-ink">Página não encontrada</h1>
        <p className="mt-2 text-sm text-muted">
          O link pode estar errado ou a página foi movida.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[3rem] touch-manipulation items-center justify-center rounded-full bg-ocean px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
        >
          Início
        </Link>
        <Link
          href="/presentes"
          className="inline-flex min-h-[3rem] touch-manipulation items-center justify-center rounded-full border border-border bg-paper px-5 py-3 text-sm font-medium text-ink transition hover:bg-canvas"
        >
          Lista de presentes
        </Link>
      </div>
    </main>
  );
}
