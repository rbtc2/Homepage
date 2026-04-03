-- WR뉴스: 썸네일(cover) + 본문 HTML (갤러리와 유사 스키마)

CREATE TABLE IF NOT EXISTS public.wr_news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '관리자',
  created_at DATE NOT NULL DEFAULT (CURRENT_DATE),
  views INTEGER NOT NULL DEFAULT 0,
  cover_image TEXT
);

CREATE INDEX IF NOT EXISTS wr_news_created_id_idx
  ON public.wr_news (created_at DESC, id DESC);

ALTER TABLE public.wr_news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on wr_news" ON public.wr_news;

CREATE POLICY "Allow public read on wr_news"
  ON public.wr_news
  FOR SELECT
  TO anon, authenticated
  USING (true);
