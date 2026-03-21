import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');
  const isAdmin = authToken?.value === '1';
  return NextResponse.json({ isAdmin });
}
