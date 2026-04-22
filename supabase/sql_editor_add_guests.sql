-- =============================================================================
-- Cola e executa no Supabase: SQL Editor → New query → Run
-- Corrige: "Could not find the table 'public.guests' in the schema cache"
-- Idempotente: podes voltar a correr sem erro se já existir.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  email text,
  phone text,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guests_slug_idx ON public.guests (slug);

ALTER TABLE public.gifts
  ADD COLUMN IF NOT EXISTS accent_color text NOT NULL DEFAULT '#6366f1';

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- API PostgREST (anon/authenticated não têm políticas em guests — o app usa
-- service_role no servidor para convidados e convites.)

COMMENT ON TABLE public.guests IS 'Convites personalizados /convite/[slug]; escrita via service role.';
