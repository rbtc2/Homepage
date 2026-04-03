-- 공시자료·갤러리: anon/authenticated는 SELECT만, 쓰기는 서비스 롤(서버)만

-- disclosures
ALTER TABLE public.disclosures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on disclosures" ON public.disclosures;

CREATE POLICY "Allow public read on disclosures"
  ON public.disclosures
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on gallery" ON public.gallery;

CREATE POLICY "Allow public read on gallery"
  ON public.gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);
