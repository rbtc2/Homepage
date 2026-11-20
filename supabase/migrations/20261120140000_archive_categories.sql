-- 자료실 카테고리(말머리)
-- 사용 여부는 archive_board_settings 한 행.
-- 토글을 꺼도 분류와 글의 category_id 는 지우지 않고, 화면에서만 숨긴다.
-- 분류를 삭제하면 그 글을 쓰던 글은 category_id 가 NULL 이 된다.

CREATE TABLE IF NOT EXISTS public.archive_board_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  categories_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.archive_board_settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM public.archive_board_settings WHERE id = 1);

CREATE TABLE IF NOT EXISTS public.archive_categories (
  id BIGSERIAL PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT archive_categories_name_len CHECK (char_length(btrim(name)) BETWEEN 1 AND 20),
  CONSTRAINT archive_categories_name_en_len CHECK (char_length(btrim(name_en)) <= 40)
);

CREATE UNIQUE INDEX IF NOT EXISTS archive_categories_name_unique
  ON public.archive_categories (lower(btrim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS archive_categories_name_en_unique
  ON public.archive_categories (lower(btrim(name_en)))
  WHERE btrim(name_en) <> '';

ALTER TABLE public.archive
  ADD COLUMN IF NOT EXISTS category_id bigint REFERENCES public.archive_categories (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS archive_category_id_idx
  ON public.archive (category_id);

ALTER TABLE public.archive_board_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on archive_board_settings" ON public.archive_board_settings;
CREATE POLICY "Allow public read on archive_board_settings"
  ON public.archive_board_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public read on archive_categories" ON public.archive_categories;
CREATE POLICY "Allow public read on archive_categories"
  ON public.archive_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON TABLE public.archive_board_settings TO anon, authenticated;
GRANT ALL ON TABLE public.archive_board_settings TO service_role;

GRANT SELECT ON TABLE public.archive_categories TO anon, authenticated;
GRANT ALL ON TABLE public.archive_categories TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.archive_categories_id_seq TO service_role;
