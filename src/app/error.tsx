"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div>
        <p className="font-display text-2xl font-medium text-ink">
          Algo correu mal
        </p>
        <p className="mt-2 text-sm text-muted">
          Tenta de novo. Se o problema continuar, volta mais tarde.
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-ocean px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95"
      >
        Tentar outra vez
      </button>
    </main>
  );
}
