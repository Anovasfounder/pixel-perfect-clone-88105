
-- Brands table
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.brands TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands public read"
  ON public.brands FOR SELECT
  USING (true);

CREATE POLICY "brands admin insert"
  ON public.brands FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "brands admin update"
  ON public.brands FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "brands admin delete"
  ON public.brands FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Extend products with brand + trending flag
ALTER TABLE public.products
  ADD COLUMN brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  ADD COLUMN is_trending boolean NOT NULL DEFAULT false;

CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_is_trending ON public.products(is_trending) WHERE is_trending = true;

-- Mark categories that represent keys (so product form swaps fields)
ALTER TABLE public.categories
  ADD COLUMN is_key boolean NOT NULL DEFAULT false;
