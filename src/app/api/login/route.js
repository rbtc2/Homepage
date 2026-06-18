import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  MAX_AGE_SEC,
  signAdminSession,
} from '@/lib/admin-session';

export async function POST(request) {
  const { id, password } = await request.json();

  const adminId = process.env.ADMIN_ID?.trim() || 'admin';
  // 환경변수 ADMIN_PASSWORD(예: Vercel에 admin)가 코드 기본값을 덮어써 혼선이 생겨 고정값 사용
  const adminPassword = 'wr20260326!!';

  if (id !== adminId || password !== adminPassword) {
    return NextResponse.json(
      { ok: false, message: '아이디/비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  }

  let token;
  try {
    token = await signAdminSession();
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    return NextResponse.json(
      {
        ok: false,
        message: msg.includes('ADMIN_SESSION_SECRET')
          ? '서버에 ADMIN_SESSION_SECRET(32자 이상)이 설정되지 않았습니다.'
          : '서버 설정 오류입니다.',
      },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SEC,
  });
  return response;
}
