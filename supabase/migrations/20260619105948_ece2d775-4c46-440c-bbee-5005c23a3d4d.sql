-- Budgets table for customisable budget tiers
CREATE TABLE public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  max_amount numeric NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.budgets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT ALL ON public.budgets TO service_role;

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Budgets viewable by everyone" ON public.budgets FOR SELECT USING (true);
CREATE POLICY "Admins insert budgets" ON public.budgets FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update budgets" ON public.budgets FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete budgets" ON public.budgets FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Flag products as "key" type (Minecraft keys etc.)
ALTER TABLE public.products ADD COLUMN is_key boolean NOT NULL DEFAULT false;

-- Optional fields for keys
ALTER TABLE public.products ADD COLUMN platform text;
ALTER TABLE public.products ADD COLUMN region text;

-- Seed a few default budget tiers
INSERT INTO public.budgets (label, max_amount, sort_order) VALUES
  ('₹499', 499, 1),
  ('₹999', 999, 2),
  ('₹1,999', 1999, 3),
  ('₹3,999', 3999, 4);
