import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('auth_token');

  if (!authToken || authToken.value !== '1') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
