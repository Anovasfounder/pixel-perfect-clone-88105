DROP POLICY IF EXISTS "Anyone can record sale" ON public.sales;

CREATE POLICY "Anyone can record sale with valid product"
ON public.sales
FOR INSERT
TO anon, authenticated
WITH CHECK (
  product_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = sales.product_id)
  AND customer_email IS NOT NULL
  AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND customer_name IS NOT NULL
  AND length(btrim(customer_name)) > 0
  AND amount IS NOT NULL
  AND amount >= 0
);