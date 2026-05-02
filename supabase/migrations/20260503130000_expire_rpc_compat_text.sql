-- BD existentes podem ter reservations.status em text (sem enum reservation_status).
-- Literais sem cast funcionam com enum ou text.
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
    WHERE status = 'reserved'
      AND expires_at < now()
  LOOP
    UPDATE public.reservations
    SET status = 'expired'
    WHERE id = r.id;

    IF NOT EXISTS (
      SELECT 1
      FROM public.reservations x
      WHERE x.gift_id = r.gift_id
        AND x.status = 'reserved'
    ) THEN
      UPDATE public.gifts
      SET
        status = 'available',
        updated_at = now()
      WHERE id = r.gift_id
        AND status = 'reserved';
    END IF;

    n := n + 1;
  END LOOP;

  RETURN n;
END;
$$;

REVOKE ALL ON FUNCTION public.run_expire_stale_reservations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_expire_stale_reservations() TO service_role;
