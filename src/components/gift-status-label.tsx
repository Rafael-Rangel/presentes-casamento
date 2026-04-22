import type { GiftStatus } from "@/lib/types";

const labels: Record<GiftStatus, string> = {
  available: "Disponível",
  reserved: "Reservado",
  confirmed: "Confirmado",
  coming_soon: "Em breve",
};

export function giftStatusLabel(status: GiftStatus): string {
  return labels[status] ?? status;
}
