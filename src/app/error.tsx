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
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-5 px-3 py-16 pb-[max(3rem,env(safe-area-inset-bottom))] text-center sm:gap-6 sm:px-4 sm:py-24">
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
        className="min-h-[3rem] w-full max-w-xs touch-manipulation rounded-full bg-ocean px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-95 sm:w-auto sm:text-sm"
      >
        Tentar outra vez
      </button>
    </main>
  );
}
