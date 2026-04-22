/** Formato YYYY-MM para comparar com `release_month`. */
export function currentMonthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function isGiftUnlocked(releaseMonth: string | null, status: string): boolean {
  if (status === "coming_soon") return false;
  const m = releaseMonth?.trim();
  if (!m) return true;
  return m <= currentMonthKey();
}
