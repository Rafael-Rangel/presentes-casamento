/** Fuso usado em listas, liberação de presentes e datas do site (Brasil). */
export const APP_TIME_ZONE = "America/Sao_Paulo" as const;

/**
 * Chave `YYYY-MM` do mês civil atual em {@link APP_TIME_ZONE}
 * (comparar com `gifts.release_month`).
 */
export function currentMonthKeyInAppTz(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  return `${year}-${month}`;
}

/** `release_month` (YYYY-MM) → valor inicial de `<input type="date">` (1.º dia do mês). */
export function releaseMonthToDateInputValue(month: string | null | undefined): string {
  const t = month?.trim();
  if (!t || !/^\d{4}-\d{2}$/.test(t)) return "";
  return `${t}-01`;
}

/**
 * Valor `YYYY-MM-DD` do `<input type="date">` → `YYYY-MM` para a coluna `release_month`.
 * Valida dia/mês/ano civil (evita 31/02, etc.).
 */
/** Mostrar instante ISO em pt-BR no fuso da app (ex.: reservas). */
export function formatDateTimePtBrInAppTz(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dateInputToReleaseMonth(iso: string | null | undefined): string | null {
  const t = iso?.trim();
  if (!t) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [ys, ms, ds] = t.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const day = Number(ds);
  if (!Number.isInteger(y) || y < 2000 || y > 2100) return null;
  if (!Number.isInteger(m) || m < 1 || m > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  const utc = Date.UTC(y, m - 1, day);
  const dt = new Date(utc);
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return `${ys}-${ms}`;
}
