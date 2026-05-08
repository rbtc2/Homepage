-- 회원가입(단체 후원) 신청 폼 등 외부 링크 URL
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS signup_application_url text NOT NULL DEFAULT 'https://example.com';
