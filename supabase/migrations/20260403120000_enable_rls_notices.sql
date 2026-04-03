-- 공지사항: PostgREST(anon)로는 읽기만 허용, 쓰기는 서비스 롤(서버)에서만 수행
-- Supabase Dashboard → SQL Editor에서 실행하거나: supabase db push

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있으면 충돌할 수 있으므로 이름으로 제거 후 재생성
DROP POLICY IF EXISTS "Allow public read on notices" ON public.notices;

CREATE POLICY "Allow public read on notices"
  ON public.notices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- INSERT/UPDATE/DELETE는 정책 없음 → anon/authenticated 불가
-- 서버에서 SUPABASE_SERVICE_ROLE_KEY 클라이언트로만 변경 가능 (RLS 우회)
