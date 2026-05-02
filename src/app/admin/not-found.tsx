import Link from "next/link";

/** 404 dentro de `/admin` — sem header do site público. */
export default function AdminNotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <p className="font-display text-2xl font-medium text-ink">404</p>
      <p className="text-sm text-muted">Esta página do painel não existe.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-ocean-deep px-5 text-sm font-medium text-paper"
        >
          Painel
        </Link>
        <Link
          href="/presentes"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-ink"
        >
          Ver site
        </Link>
      </div>
    </main>
  );
}
