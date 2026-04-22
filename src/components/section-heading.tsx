import type { LucideIcon } from "lucide-react";

export function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <div
        className={`mb-3 flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ocean/10 text-ocean ring-1 ring-ocean/20">
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
