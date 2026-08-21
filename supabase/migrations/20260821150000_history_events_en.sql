-- 연혁 영문 오버레이: 같은 항목에 영문 내용·부가 설명만 추가 (연도·월은 공유)
-- 한국어 title은 필수, 영문은 선택. 빈 문자열이면 공개 영문 사이트는 한국어를 보여 줍니다.

ALTER TABLE public.history_events
  ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS detail_en text NOT NULL DEFAULT '';
