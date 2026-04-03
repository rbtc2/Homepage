-- WR뉴스: 썸네일(cover) + 본문 HTML (갤러리와 유사 스키마)
-- Supabase 호스트(DB)에서 실행하세요. 로컬 순수 Postgres에는 anon/authenticated 역할이 없어 TO/GRANT 구문이 실패할 수 있습니다.

CREATE TABLE IF NOT EXISTS public.wr_news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '관리자',
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER NOT NULL DEFAULT 0,
  cover_image TEXT
);

CREATE INDEX IF NOT EXISTS wr_news_created_id_idx
  ON public.wr_news (created_at DESC, id DESC);

ALTER TABLE public.wr_news ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있으면 모두 제거 후 단일 SELECT 정책만 둠 (갤러리 RLS 수정 마이그레이션과 동일 패턴)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wr_news'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.wr_news', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Allow public read on wr_news"
  ON public.wr_news
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- PostgREST(anon/authenticated)가 테이블을 읽을 수 있게 권한 부여
GRANT SELECT ON TABLE public.wr_news TO anon, authenticated;
GRANT ALL ON TABLE public.wr_news TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.wr_news_id_seq TO service_role;
