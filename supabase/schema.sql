-- Executar no SQL Editor do Supabase (projeto novo).
-- Depois: promover um utilizador a admin — ver README.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Perfis
CREATE TYPE public.profile_role AS ENUM ('guest', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  role public.profile_role NOT NULL DEFAULT 'guest',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_auth_user_id_key UNIQUE (auth_user_id)
);

CREATE INDEX profiles_auth_user_id_idx ON public.profiles (auth_user_id);

-- Presentes
CREATE TYPE public.gift_priority AS ENUM ('essential', 'high', 'normal');
CREATE TYPE public.gift_status AS ENUM (
  'available',
  'reserved',
  'confirmed',
  'coming_soon'
);

CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  estimated_price numeric(12, 2),
  category text NOT NULL DEFAULT '',
  priority public.gift_priority NOT NULL DEFAULT 'normal',
  status public.gift_status NOT NULL DEFAULT 'available',
  release_month text,
  image_url text,
  store_url text,
  accent_color text NOT NULL DEFAULT '#6366f1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX gifts_status_idx ON public.gifts (status);
CREATE INDEX gifts_category_idx ON public.gifts (category);

-- Convidados (URL /convite/[slug]; escrita via service role no servidor)
CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  email text,
  phone text,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guests_slug_idx ON public.guests (slug);

-- Reservas
CREATE TYPE public.reservation_status AS ENUM ('reserved', 'confirmed', 'expired');

CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id uuid NOT NULL REFERENCES public.gifts (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '',
  purchase_estimate date,
  receipt_path text,
  expires_at timestamptz NOT NULL,
  is_surprise boolean NOT NULL DEFAULT false,
  status public.reservation_status NOT NULL DEFAULT 'reserved',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX reservations_user_id_idx ON public.reservations (user_id);
CREATE INDEX reservations_gift_id_idx ON public.reservations (gift_id);

-- Trigger: novo utilizador em auth.users -> perfil guest
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Reserva atómica (evita corrida entre duas reservas)
CREATE OR REPLACE FUNCTION public.reserve_gift(
  p_gift_id uuid,
  p_message text,
  p_purchase_estimate date,
  p_is_surprise boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id uuid;
  v_gift_status public.gift_status;
  v_reservation_id uuid;
BEGIN
  SELECT id INTO v_profile_id
  FROM public.profiles
  WHERE auth_user_id = auth.uid();

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Perfil não encontrado';
  END IF;

  SELECT status INTO v_gift_status
  FROM public.gifts
  WHERE id = p_gift_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Presente não encontrado';
  END IF;

  IF v_gift_status IS DISTINCT FROM 'available' THEN
    RAISE EXCEPTION 'Presente não disponível';
  END IF;

  UPDATE public.gifts
  SET status = 'reserved', updated_at = now()
  WHERE id = p_gift_id;

  INSERT INTO public.reservations (
    gift_id,
    user_id,
    message,
    purchase_estimate,
    expires_at,
    is_surprise,
    status
  )
  VALUES (
    p_gift_id,
    v_profile_id,
    COALESCE(p_message, ''),
    p_purchase_estimate,
    now() + interval '48 hours',
    COALESCE(p_is_surprise, false),
    'reserved'
  )
  RETURNING id INTO v_reservation_id;

  RETURN v_reservation_id;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_gift(uuid, text, date, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reserve_gift(uuid, text, date, boolean) TO authenticated;

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Perfis: ver o próprio; admins veem todos
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "profiles_select_admin_all"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Presentes: leitura pública
CREATE POLICY "gifts_select_public"
  ON public.gifts FOR SELECT
  USING (true);

CREATE POLICY "gifts_insert_admin"
  ON public.gifts FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "gifts_update_admin"
  ON public.gifts FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "gifts_delete_admin"
  ON public.gifts FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Reservas: dono ou admin
CREATE POLICY "reservations_select_own_or_admin"
  ON public.reservations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = reservations.user_id AND p.auth_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Opcional: admins podem ajustar reservas manualmente
CREATE POLICY "reservations_update_admin"
  ON public.reservations FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Expira reservas em atraso e repõe presentes (chamada via service role / cron)
CREATE OR REPLACE FUNCTION public.run_expire_stale_reservations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int := 0;
  r record;
BEGIN
  FOR r IN
    SELECT id, gift_id
    FROM public.reservations
    WHERE status = 'reserved'::public.reservation_status
      AND expires_at < now()
  LOOP
    UPDATE public.reservations
    SET status = 'expired'::public.reservation_status
    WHERE id = r.id;

    IF NOT EXISTS (
      SELECT 1
      FROM public.reservations x
      WHERE x.gift_id = r.gift_id
        AND x.status = 'reserved'::public.reservation_status
    ) THEN
      UPDATE public.gifts
      SET
        status = 'available'::public.gift_status,
        updated_at = now()
      WHERE id = r.gift_id
        AND status = 'reserved'::public.gift_status;
    END IF;

    n := n + 1;
  END LOOP;

  RETURN n;
END;
$$;

REVOKE ALL ON FUNCTION public.run_expire_stale_reservations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_expire_stale_reservations() TO service_role;

-- Storage: imagens dos presentes (bucket público; upload via service role na app)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-images',
  'gift-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read gift images" ON storage.objects;
CREATE POLICY "Public read gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');
