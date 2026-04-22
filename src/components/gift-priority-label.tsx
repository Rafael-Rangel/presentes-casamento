import type { GiftPriority } from "@/lib/types";

const labels: Record<GiftPriority, string> = {
  essential: "Essencial",
  high: "Alta",
  normal: "Normal",
};

export function giftPriorityLabel(p: GiftPriority): string {
  return labels[p] ?? p;
}
