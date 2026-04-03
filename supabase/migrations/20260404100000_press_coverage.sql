-- 언론보도(외부 기사 클리핑): 원문 URL·언론사·게재일 중심
-- Supabase Dashboard → SQL Editor 또는 supabase db push

CREATE TABLE IF NOT EXISTS public.press_coverage (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  article_url TEXT NOT NULL,
  published_at DATE NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '관리자',
  created_at DATE NOT NULL DEFAULT (CURRENT_DATE),
  views INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS press_coverage_pub_id_idx
  ON public.press_coverage (published_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS press_coverage_featured_idx
  ON public.press_coverage (is_featured)
  WHERE is_featured = true;

ALTER TABLE public.press_coverage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on press_coverage" ON public.press_coverage;

CREATE POLICY "Allow public read on press_coverage"
  ON public.press_coverage
  FOR SELECT
  TO anon, authenticated
  USING (true);
