
-- 1. Restrict payment_link column visibility from public roles
REVOKE SELECT (payment_link) ON public.products FROM anon, authenticated;

-- 2. Security definer RPC to fetch a single product's payment link
CREATE OR REPLACE FUNCTION public.get_product_payment_link(p_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT payment_link FROM public.products WHERE id = p_id
$$;

REVOKE ALL ON FUNCTION public.get_product_payment_link(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_product_payment_link(uuid) TO anon, authenticated;

-- 3. Tighten sales INSERT policy so amount must match the actual product price
DROP POLICY IF EXISTS "Anyone can record sale with valid product" ON public.sales;

CREATE POLICY "Anyone can record sale with valid product"
ON public.sales
FOR INSERT
TO anon, authenticated
WITH CHECK (
  product_id IS NOT NULL
  AND customer_email IS NOT NULL
  AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND customer_name IS NOT NULL
  AND length(btrim(customer_name)) > 0
  AND amount IS NOT NULL
  AND amount = (SELECT price FROM public.products WHERE id = sales.product_id)
);
