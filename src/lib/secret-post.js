import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { hashSecretPassword } from '@/lib/secret-password';
import { actionFail } from '@/lib/admin-action-result';
import { rowIdForEq } from '@/lib/row-id-for-eq';

/** @typedef {{ table: string, pathPrefix: string, cookiePrefix: string }} SecretBoardConfig */

/** @type {Record<string, SecretBoardConfig>} */
export const SECRET_BOARD_CONFIG = {
  archive: { table: 'archive', pathPrefix: '/archive', cookiePrefix: 'archive-secret' },
  notices: { table: 'notices', pathPrefix: '/notices', cookiePrefix: 'notices-secret' },
  disclosures: {
    table: 'disclosures',
    pathPrefix: '/disclosures',
    cookiePrefix: 'disclosures-secret',
  },
  gallery: { table: 'gallery', pathPrefix: '/gallery', cookiePrefix: 'gallery-secret' },
  wr_news: { table: 'wr_news', pathPrefix: '/wr-news', cookiePrefix: 'wr-news-secret' },
  press_coverage: {
    table: 'press_coverage',
    pathPrefix: '/press',
    cookiePrefix: 'press-secret',
  },
};

export function normalizeSecretExtra(row) {
  return {
    isSecret: Boolean(row.is_secret),
    hasSecretPassword: Boolean(row.secret_password_hash),
  };
}

function unavailableSecretAuth() {
  return { isSecret: true, secretPasswordHash: null, lookupFailed: true };
}

export async function getBoardSecretAuth(table, id) {
  if (id == null || id === '') return unavailableSecretAuth();
  const idEq = typeof id === 'number' ? id : String(id).trim();
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .select('is_secret, secret_password_hash')
    .eq('id', idEq)
    .single();

  if (error || !data) {
    console.error('[getBoardSecretAuth]', table, id, error?.message ?? error);
    return unavailableSecretAuth();
  }
  return {
    isSecret: Boolean(data.is_secret),
    secretPasswordHash: data.secret_password_hash || null,
    lookupFailed: false,
  };
}

/** 관리자 편집 시 hasSecretPassword를 admin 조회로 보정 (anon은 해시 컬럼 REVOKE) */
export function withSecretEditMeta(post, secretAuth) {
  if (!post) return post;
  if (secretAuth?.lookupFailed) {
    return {
      ...post,
      isSecret: Boolean(post.isSecret),
      hasSecretPassword: Boolean(post.hasSecretPassword),
    };
  }
  return {
    ...post,
    isSecret: Boolean(secretAuth?.isSecret ?? post.isSecret),
    hasSecretPassword: Boolean(secretAuth?.secretPasswordHash),
  };
}

export function secretCookieName(cookiePrefix, id) {
  return `${cookiePrefix}-${id}`;
}

export async function canReadSecretPost({
  isSecret,
  secretPasswordHash,
  cookiePrefix,
  id,
  lookupFailed,
}) {
  if (lookupFailed) return false;
  if (!isSecret) return true;
  if (!secretPasswordHash) return false;
  const cookieStore = await cookies();
  return cookieStore.get(secretCookieName(cookiePrefix, id))?.value === secretPasswordHash;
}

/**
 * create용 비밀글 컬럼 해석. 실패 시 { error } 반환.
 * @returns {{ error: object } | { fields: { is_secret: boolean, secret_password_hash: string | null } }}
 */
export function resolveSecretFieldsForCreate({ isSecret, secretPassword }) {
  const secretEnabled = Boolean(isSecret);
  const normalizedPassword = String(secretPassword ?? '').trim();
  if (secretEnabled && !normalizedPassword) {
    return { error: actionFail('비밀글 비밀번호를 입력해 주세요.') };
  }
  return {
    fields: {
      is_secret: secretEnabled,
      secret_password_hash: secretEnabled ? hashSecretPassword(normalizedPassword) : null,
    },
  };
}

/**
 * update용 비밀글 컬럼 해석. 기존 해시 유지 가능.
 * @returns {Promise<{ error: object } | { fields: { is_secret: boolean, secret_password_hash: string | null } }>}
 */
export async function resolveSecretFieldsForUpdate(table, id, { isSecret, secretPassword }) {
  const secretEnabled = Boolean(isSecret);
  const normalizedPassword = String(secretPassword ?? '').trim();
  const idEq = rowIdForEq(id);

  let nextSecretHash = null;
  if (secretEnabled) {
    if (normalizedPassword) {
      nextSecretHash = hashSecretPassword(normalizedPassword);
    } else {
      const { data: current, error: currentError } = await getSupabaseAdmin()
        .from(table)
        .select('secret_password_hash')
        .eq('id', idEq)
        .single();
      if (currentError) return { error: actionFail(currentError.message) };
      if (!current?.secret_password_hash) {
        return { error: actionFail('비밀글 비밀번호를 입력해 주세요.') };
      }
      nextSecretHash = current.secret_password_hash;
    }
  }

  return {
    fields: {
      is_secret: secretEnabled,
      secret_password_hash: nextSecretHash,
    },
  };
}
