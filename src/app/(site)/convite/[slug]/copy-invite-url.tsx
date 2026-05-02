"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyInviteUrl({ url }: { url: string }) {
  const [done, setDone] = useState(false);

  return (
    <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <code className="block max-h-32 overflow-y-auto break-all rounded-xl bg-ocean-deep/50 px-3 py-3 text-left text-[11px] leading-snug text-paper/95 ring-1 ring-paper/10 sm:max-h-none sm:flex-1 sm:px-4 sm:text-xs">
        {url}
      </code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
        className="inline-flex min-h-[3rem] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-paper/25 bg-paper/15 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-paper/25"
      >
        <Copy className="h-4 w-4" aria-hidden />
        {done ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
