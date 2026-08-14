-- 전 게시판 비밀글 기능 (archive 제외 — 이미 적용됨)
-- is_secret: 비밀글 여부
-- secret_password_hash: 비밀글 열람 비밀번호 해시(scrypt)

ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secret_password_hash text;

ALTER TABLE public.disclosures
  ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secret_password_hash text;

ALTER TABLE public.gallery
  ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secret_password_hash text;

ALTER TABLE public.wr_news
  ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secret_password_hash text;

ALTER TABLE public.press_coverage
  ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secret_password_hash text;

REVOKE SELECT (secret_password_hash) ON public.notices FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.disclosures FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.gallery FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.wr_news FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.press_coverage FROM anon, authenticated;
