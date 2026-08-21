-- 공지사항 영문 오버레이: 같은 글에 영문 제목·본문만 추가 (작성일·고정·조회는 공유)
-- 한국어 title/content는 필수, 영문은 선택. 빈 문자열이면 공개 영문 사이트는 한국어를 보여 줍니다.

ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_en text NOT NULL DEFAULT '';
