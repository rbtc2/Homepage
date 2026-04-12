-- 사이트 푸터 등에 노출되는 연락처·주소 (단일 행)
-- anon: SELECT만, 쓰기는 서비스 롤(서버 액션)만

CREATE TABLE IF NOT EXISTS public.site_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  office_address text NOT NULL DEFAULT '',
  representative_name text NOT NULL DEFAULT '',
  main_phone text NOT NULL DEFAULT '',
  fax_number text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on site_settings" ON public.site_settings;

CREATE POLICY "Allow public read on site_settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 초기값(기존 푸터 하드코딩과 동일) — 이미 있으면 건너뜀
INSERT INTO public.site_settings (id, office_address, representative_name, main_phone, fax_number)
SELECT
  1,
  '서울특별시 송파구 중대로 150 백암빌딩 6층 602-A23호',
  '김진영',
  '070-8018-9232',
  '0504-287-7334'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 1);
