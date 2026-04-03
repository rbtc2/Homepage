-- gallery: FOR ALL / INSERT·UPDATE·DELETE + USING(true) 정책이 있으면
-- Security Advisor가 "RLS Policy Always True"로 경고함.
-- public 읽기는 SELECT만 두고, 나머지 정책은 제거 후 SELECT만 재생성.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gallery'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.gallery', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on gallery"
  ON public.gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 쓰기: 앱에서 SUPABASE_SERVICE_ROLE_KEY(getSupabaseAdmin)만 사용 (RLS 우회)
