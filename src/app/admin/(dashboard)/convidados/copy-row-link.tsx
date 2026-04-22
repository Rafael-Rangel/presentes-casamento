"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export function CopyRowLink({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-ocean transition hover:bg-ocean/10"
    >
      {done ? (
        <>
          <Check className="h-3.5 w-3.5 text-ocean" aria-hidden />
          Copiado
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" aria-hidden />
          Copiar URL completa
        </>
      )}
    </button>
  );
}
