-- 관리자 에디터 임시저장 (공개 API·anon 접근 없음, service_role 전용)

CREATE TABLE IF NOT EXISTS public.admin_drafts (
  id BIGSERIAL PRIMARY KEY,
  content_type TEXT NOT NULL
    CHECK (content_type IN ('notices', 'wr_news', 'gallery', 'archive', 'disclosures')),
  title TEXT NOT NULL DEFAULT '',
  payload JSONB NOT NULL DEFAULT '{}',
  source_post_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_drafts_type_updated_idx
  ON public.admin_drafts (content_type, updated_at DESC);

ALTER TABLE public.admin_drafts ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.admin_drafts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.admin_drafts_id_seq TO service_role;
