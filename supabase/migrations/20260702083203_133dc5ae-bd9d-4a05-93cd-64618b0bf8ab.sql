-- 1. Private schema to hide SECURITY DEFINER helpers from the exposed API
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

-- 2. Move has_role out of the public (API-exposed) schema.
-- RLS policies reference it by OID, so they keep working after the move.
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;

-- Execute is still needed for RLS policy evaluation (incl. anon reads of
-- announcements). Being in a non-exposed schema, it is no longer callable
-- via the Data API / PostgREST rpc, satisfying the linter.
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- 3. Drop the anon-callable payment-link function; checkout now runs
-- server-side with the service role.
DROP FUNCTION IF EXISTS public.get_product_payment_link(uuid);

-- 4. bootstrap_first_admin is a trigger function; trigger firing does not
-- require caller EXECUTE, so remove direct callability.
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;

-- 5. Sales are now recorded exclusively server-side via the service role,
-- so remove public/anon INSERT access to the PII-bearing sales table.
DROP POLICY IF EXISTS "Anyone can record sale with valid product" ON public.sales;