-- Subscrições Web Push por dispositivo (VAPID); envio usa service_role no servidor.

CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT push_subscriptions_endpoint_key UNIQUE (endpoint)
);

CREATE INDEX push_subscriptions_profile_id_idx ON public.push_subscriptions (profile_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_subscriptions_select_own"
  ON public.push_subscriptions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = push_subscriptions.profile_id AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "push_subscriptions_insert_own"
  ON public.push_subscriptions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = push_subscriptions.profile_id AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "push_subscriptions_update_own"
  ON public.push_subscriptions FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = push_subscriptions.profile_id AND p.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = push_subscriptions.profile_id AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "push_subscriptions_delete_own"
  ON public.push_subscriptions FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = push_subscriptions.profile_id AND p.auth_user_id = auth.uid()
    )
  );
