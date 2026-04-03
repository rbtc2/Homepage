import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';

export async function middleware(request) {
  const raw = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const ok = await verifyAdminSession(raw);
  if (!ok) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
