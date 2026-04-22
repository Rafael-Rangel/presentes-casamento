import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-display text-4xl font-medium text-ink">404</p>
      <div>
        <h1 className="text-lg font-semibold text-ink">Página não encontrada</h1>
        <p className="mt-2 text-sm text-muted">
          O link pode estar errado ou a página foi movida.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
        >
          Início
        </Link>
        <Link
          href="/presentes"
          className="rounded-full border border-border bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-canvas"
        >
          Lista de presentes
        </Link>
      </div>
    </main>
  );
}
