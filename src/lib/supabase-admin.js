import { createClient } from '@supabase/supabase-js';

let adminClient;

/**
 * 서버에서만 호출. RLS 우회 — Server Actions·Route Handler 한정.
 * 빌드 타임에는 env가 없을 수 있어, 첫 호출 시에만 클라이언트를 만듭니다.
 */
export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다. (서버 전용, Vercel Environment Variables에 service_role 키를 추가하세요.)'
    );
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
