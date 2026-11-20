import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';

const lib = createPostLib('disclosures', {
  select: 'id, title, content, author, created_at, views, is_secret',
  normalizeExtra: (row) => normalizeSecretExtra(row),
});

export const getDisclosures = lib.getAll;
export const getDisclosureById = lib.getById;
export const getPrevNext = lib.getPrevNext;

export async function getDisclosureSecretAuth(id) {
  return getBoardSecretAuth('disclosures', id);
}

export const getDisclosuresPage = ({ page, itemsPerPage } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchDisclosuresPage = ({ query, page, itemsPerPage } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
