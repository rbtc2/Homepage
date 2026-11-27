-- 공지사항 카테고리(말머리). 구조는 자료실(20261120140000_archive_categories.sql)과 같다.
-- 사용 여부는 notices_board_settings 한 행.
-- 토글을 꺼도 분류와 글의 category_id 는 지우지 않고, 화면에서만 숨긴다.
-- 분류를 삭제하면 그 분류를 쓰던 글은 category_id 가 NULL 이 된다.

CREATE TABLE IF NOT EXISTS public.notices_board_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  categories_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.notices_board_settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM public.notices_board_settings WHERE id = 1);

CREATE TABLE IF NOT EXISTS public.notices_categories (
  id BIGSERIAL PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notices_categories_name_len CHECK (char_length(btrim(name)) BETWEEN 1 AND 20),
  CONSTRAINT notices_categories_name_en_len CHECK (char_length(btrim(name_en)) <= 40)
);

CREATE UNIQUE INDEX IF NOT EXISTS notices_categories_name_unique
  ON public.notices_categories (lower(btrim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS notices_categories_name_en_unique
  ON public.notices_categories (lower(btrim(name_en)))
  WHERE btrim(name_en) <> '';

ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS category_id bigint REFERENCES public.notices_categories (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS notices_category_id_idx
  ON public.notices (category_id);

ALTER TABLE public.notices_board_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on notices_board_settings" ON public.notices_board_settings;
CREATE POLICY "Allow public read on notices_board_settings"
  ON public.notices_board_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public read on notices_categories" ON public.notices_categories;
CREATE POLICY "Allow public read on notices_categories"
  ON public.notices_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON TABLE public.notices_board_settings TO anon, authenticated;
GRANT ALL ON TABLE public.notices_board_settings TO service_role;

GRANT SELECT ON TABLE public.notices_categories TO anon, authenticated;
GRANT ALL ON TABLE public.notices_categories TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.notices_categories_id_seq TO service_role;
