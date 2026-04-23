import Image from "next/image";

type Props = {
  paths: string[];
  className?: string;
};

/** Mosaico 2×2: foto grande + duas pequenas (editorial). */
export function CoupleMosaic({ paths, className = "" }: Props) {
  const [a, b, c] = [paths[0], paths[1], paths[2]];

  return (
    <div
      className={`grid min-h-[220px] grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] grid-rows-2 gap-1.5 sm:min-h-[280px] sm:gap-2 md:min-h-[320px] md:gap-3 ${className}`}
      aria-hidden
    >
      <div className="relative row-span-2 min-h-0 overflow-hidden rounded-2xl rounded-br-[2rem] shadow-xl shadow-ocean-deep/15 ring-1 ring-border">
        {a ? (
          <Image
            src={a}
            alt=""
            fill
            className="object-cover object-[center_18%]"
            sizes="(max-width: 768px) 65vw, 38vw"
            priority
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ocean-deep/40 via-transparent to-terracotta/25" />
      </div>
      <div className="relative min-h-[96px] overflow-hidden rounded-xl rounded-tr-2xl ring-1 ring-border sm:min-h-[120px] md:min-h-[140px]">
        {b ? (
          <Image
            src={b}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 35vw, 22vw"
            priority
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-ocean-deep/25" />
      </div>
      <div className="relative min-h-[96px] overflow-hidden rounded-xl ring-1 ring-border sm:min-h-[120px] md:min-h-[140px]">
        {c ? (
          <Image
            src={c}
            alt=""
            fill
            className="object-cover object-[center_28%]"
            sizes="(max-width: 768px) 35vw, 22vw"
          />
        ) : null}
      </div>
    </div>
  );
}
