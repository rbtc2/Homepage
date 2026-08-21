import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import { isEnPath } from '@/lib/i18n';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const raw = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const ok = await verifyAdminSession(raw);
    if (!ok) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', isEnPath(pathname) ? 'en' : 'ko');
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/en', '/en/:path*'],
};
