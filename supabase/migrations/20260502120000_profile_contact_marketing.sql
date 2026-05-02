-- Dados de contacto / relação com os noivos + opt-in lembretes + controlo de emails de marketing.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS relationship_note text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS marketing_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_marketing_email_at timestamptz;

COMMENT ON COLUMN public.profiles.phone IS 'Telefone do convidado (preenchido no perfil ou na reserva).';
COMMENT ON COLUMN public.profiles.relationship_note IS 'Como conhece os noivos (texto livre).';
COMMENT ON COLUMN public.profiles.profile_completed_at IS 'Quando preencheu nome, telefone e relação (fluxo completo).';
COMMENT ON COLUMN public.profiles.marketing_opt_in IS 'Consentimento para lembretes sobre a lista (LGPD).';
COMMENT ON COLUMN public.profiles.last_marketing_email_at IS 'Último envio de email de lembrete (evita spam).';
