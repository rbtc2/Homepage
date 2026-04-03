import { createClient } from '@supabase/supabase-js';

let adminClient;

/**
 * 서버에서만 호출. RLS 우회 — Server Actions·Route Handler 한정.
 * 빌드 타임에는 env가 없을 수 있어, 첫 호출 시에만 클라이언트를 만듭니다.
 */
export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL이 비어 있습니다. Vercel → Settings → Environment Variables에서 Production(또는 접속 중인 배포 환경)에 Key를 정확히 넣고, 저장 후 Redeploy 하세요.'
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY가 비어 있습니다. Vercel에 서버 전용으로 추가하세요(Key 철자·대소문자 동일). Production/Preview 중 실제로 여는 URL과 같은 환경에 넣었는지 확인하고 Redeploy 하세요. (NEXT_PUBLIC_ 접두사 붙이지 마세요.)'
    );
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
