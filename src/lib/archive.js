import { createPostLib } from './db';
import { getSupabaseAdmin } from './supabase-admin';

const lib = createPostLib('archive', {
  normalizeExtra: (row) => ({
    isSecret: Boolean(row.is_secret),
    hasSecretPassword: Boolean(row.secret_password_hash),
  }),
});

export const getArchives = lib.getAll;
export const searchArchives = lib.search;
export const getArchiveById = lib.getById;
export const getPrevNext = lib.getPrevNext;

export async function getArchiveSecretAuth(id) {
  if (id == null || id === '') return { isSecret: false, secretPasswordHash: null };
  const idEq = typeof id === 'number' ? id : String(id).trim();
  const { data, error } = await getSupabaseAdmin()
    .from('archive')
    .select('is_secret, secret_password_hash')
    .eq('id', idEq)
    .single();

  if (error || !data) return { isSecret: false, secretPasswordHash: null };
  return {
    isSecret: Boolean(data.is_secret),
    secretPasswordHash: data.secret_password_hash || null,
  };
}

export const getArchivesPage = ({ page, itemsPerPage } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchArchivesPage = ({ query, page, itemsPerPage } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
