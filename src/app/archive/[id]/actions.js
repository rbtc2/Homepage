'use server';

import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifySecretPassword } from '@/lib/secret-password';

const COOKIE_MAX_AGE = 60 * 60 * 12;

export async function verifyArchiveSecretPassword({ id, password }) {
  const archiveId = Number(id);
  const normalizedPassword = String(password ?? '').trim();
  if (!Number.isFinite(archiveId) || archiveId <= 0) {
    throw new Error('잘못된 접근입니다.');
  }
  if (!normalizedPassword) {
    throw new Error('비밀번호를 입력해 주세요.');
  }

  const { data, error } = await getSupabaseAdmin()
    .from('archive')
    .select('id, is_secret, secret_password_hash')
    .eq('id', archiveId)
    .single();

  if (error || !data) {
    throw new Error('게시물을 찾을 수 없습니다.');
  }

  if (!data.is_secret || !data.secret_password_hash) {
    return { ok: true };
  }

  const matched = verifySecretPassword(normalizedPassword, data.secret_password_hash);
  if (!matched) {
    throw new Error('비밀번호가 올바르지 않습니다.');
  }

  const cookieStore = await cookies();
  cookieStore.set(`archive-secret-${archiveId}`, data.secret_password_hash, {
    httpOnly: true,
    sameSite: 'lax',
    path: `/archive/${archiveId}`,
    maxAge: COOKIE_MAX_AGE,
  });

  return { ok: true };
}
