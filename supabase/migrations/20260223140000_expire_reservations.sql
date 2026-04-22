-- Expira reservas em atraso e repõe o presente para disponível quando não há outra reserva ativa.
-- Chamado pela rota /api/cron/expire-reservations (Vercel Cron) com service role.

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
