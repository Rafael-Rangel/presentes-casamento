/** Perfil considerado completo para reservar quando tem nome, telefone e nota de relação. */
export type ProfileRowForComplete = {
  full_name: string;
  phone: string | null;
  relationship_note: string | null;
  profile_completed_at: string | null;
};

export function isGuestProfileComplete(p: ProfileRowForComplete): boolean {
  if (p.profile_completed_at) return true;
  const name = p.full_name?.trim() ?? "";
  const phone = (p.phone ?? "").trim();
  const rel = (p.relationship_note ?? "").trim();
  return Boolean(name && phone && rel);
}
