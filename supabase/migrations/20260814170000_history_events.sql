-- 단체 연혁 (관리자 CRUD, 공개 SELECT)

CREATE TABLE IF NOT EXISTS public.history_events (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL
    CHECK (year BETWEEN 1900 AND 2100),
  month SMALLINT NOT NULL
    CHECK (month BETWEEN 1 AND 12),
  title TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS history_events_year_month_idx
  ON public.history_events (year DESC, month DESC, id DESC);

ALTER TABLE public.history_events ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'history_events'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.history_events', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Allow public read on history_events"
  ON public.history_events
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON TABLE public.history_events TO anon, authenticated;
GRANT ALL ON TABLE public.history_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.history_events_id_seq TO service_role;

INSERT INTO public.history_events (year, month, title)
SELECT 2026, 7, '이주여성 문화 콘텐츠 강사 양성과정 1기 입과'
WHERE NOT EXISTS (
  SELECT 1 FROM public.history_events
  WHERE year = 2026 AND month = 7
    AND title = '이주여성 문화 콘텐츠 강사 양성과정 1기 입과'
);

INSERT INTO public.history_events (year, month, title)
SELECT 2026, 3, '창립총회 개회'
WHERE NOT EXISTS (
  SELECT 1 FROM public.history_events
  WHERE year = 2026 AND month = 3
    AND title = '창립총회 개회'
);
