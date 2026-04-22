-- Convidados (URL /convite/[slug]) + cor de destaque nos presentes
-- Executar via CLI (db push) ou colar no SQL Editor.

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
