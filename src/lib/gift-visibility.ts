import { currentMonthKeyInAppTz } from "@/lib/app-timezone";

/** Formato YYYY-MM para comparar com `release_month` (mês civil em America/Sao_Paulo). */
export function currentMonthKey(d = new Date()): string {
  return currentMonthKeyInAppTz(d);
}

export function isGiftUnlocked(releaseMonth: string | null, status: string): boolean {
  if (status === "coming_soon") return false;
  const m = releaseMonth?.trim();
  if (!m) return true;
  return m <= currentMonthKey();
}
