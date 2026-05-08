import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  MAX_AGE_SEC,
  signAdminSession,
} from '@/lib/admin-session';

export async function POST(request) {
  const { id, password } = await request.json();

  const adminId = 'admin';
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
  } catch {
    return NextResponse.json(
      { ok: false, message: '서버 설정 오류입니다.' },
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
