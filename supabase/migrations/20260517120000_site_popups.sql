-- 홈페이지 노출 팝업 (관리자 CRUD, 공개 SELECT)

CREATE TABLE IF NOT EXISTS public.site_popups (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL DEFAULT '',
  display_mode TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (display_mode IN ('immediate', 'scheduled')),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  position TEXT NOT NULL DEFAULT 'center'
    CHECK (position IN ('center', 'top-left', 'top-right', 'bottom-left', 'bottom-right')),
  width_px INTEGER,
  height_px INTEGER,
  offset_x INTEGER NOT NULL DEFAULT 0,
  offset_y INTEGER NOT NULL DEFAULT 0,
  show_close_for_day BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS site_popups_schedule_idx
  ON public.site_popups (display_mode, is_active, start_at, end_at);

ALTER TABLE public.site_popups ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_popups'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.site_popups', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Allow public read on site_popups"
  ON public.site_popups
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON TABLE public.site_popups TO anon, authenticated;
GRANT ALL ON TABLE public.site_popups TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.site_popups_id_seq TO service_role;
