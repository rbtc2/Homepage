-- WR뉴스 썸네일(cover)을 본문에서 본문 삽입 이미지처럼 px 너비로 표시하기 위한 컬럼.
-- NULL이면 기존처럼 본문 전체 너비.

ALTER TABLE public.wr_news
  ADD COLUMN IF NOT EXISTS cover_width integer;

ALTER TABLE public.wr_news
  DROP CONSTRAINT IF EXISTS wr_news_cover_width_range;

ALTER TABLE public.wr_news
  ADD CONSTRAINT wr_news_cover_width_range
  CHECK (cover_width IS NULL OR (cover_width >= 40 AND cover_width <= 2400));

COMMENT ON COLUMN public.wr_news.cover_width IS '본문 커버 이미지 표시 너비(px). NULL이면 전체 너비.';
