-- 자료실 비밀글 기능
-- is_secret: 비밀글 여부
-- secret_password_hash: 비밀글 열람 비밀번호 해시(scrypt)

ALTER TABLE public.archive
  ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secret_password_hash text;

REVOKE SELECT (secret_password_hash) ON public.archive FROM anon, authenticated;
