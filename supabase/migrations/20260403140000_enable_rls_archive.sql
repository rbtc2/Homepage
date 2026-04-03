-- 자료실(archive): anon/authenticated SELECT만, 쓰기는 서비스 롤

ALTER TABLE public.archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on archive" ON public.archive;

CREATE POLICY "Allow public read on archive"
  ON public.archive
  FOR SELECT
  TO anon, authenticated
  USING (true);
