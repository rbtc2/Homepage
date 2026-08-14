'use server';

import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifySecretPassword } from '@/lib/secret-password';
import { actionOk, actionFail } from '@/lib/admin-action-result';
import { SECRET_BOARD_CONFIG, secretCookieName } from '@/lib/secret-post';

const COOKIE_MAX_AGE = 60 * 60 * 12;

/**
 * 게시판 공통 비밀글 비밀번호 검증 + 쿠키 설정
 * @param {{ board: keyof typeof SECRET_BOARD_CONFIG, id: string | number, password: string }} params
 */
export async function verifyBoardSecretPassword({ board, id, password }) {
  const config = SECRET_BOARD_CONFIG[board];
  if (!config) {
    return actionFail('잘못된 접근입니다.');
  }

  const postId = Number(id);
  const normalizedPassword = String(password ?? '').trim();
  if (!Number.isFinite(postId) || postId <= 0) {
    return actionFail('잘못된 접근입니다.');
  }
  if (!normalizedPassword) {
    return actionFail('비밀번호를 입력해 주세요.');
  }

  const { data, error } = await getSupabaseAdmin()
    .from(config.table)
    .select('id, is_secret, secret_password_hash')
    .eq('id', postId)
    .single();

  if (error || !data) {
    return actionFail('게시물을 찾을 수 없습니다.');
  }

  if (!data.is_secret || !data.secret_password_hash) {
    return actionOk();
  }

  const matched = verifySecretPassword(normalizedPassword, data.secret_password_hash);
  if (!matched) {
    return actionFail('비밀번호가 올바르지 않습니다.');
  }

  const cookieStore = await cookies();
  cookieStore.set(secretCookieName(config.cookiePrefix, postId), data.secret_password_hash, {
    httpOnly: true,
    sameSite: 'lax',
    path: `${config.pathPrefix}/${postId}`,
    maxAge: COOKIE_MAX_AGE,
  });

  return actionOk();
}
