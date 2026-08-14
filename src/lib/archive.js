import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';

const lib = createPostLib('archive', {
  normalizeExtra: (row) => normalizeSecretExtra(row),
});

export const getArchives = lib.getAll;
export const searchArchives = lib.search;
export const getArchiveById = lib.getById;
export const getPrevNext = lib.getPrevNext;

export async function getArchiveSecretAuth(id) {
  return getBoardSecretAuth('archive', id);
}

export const getArchivesPage = ({ page, itemsPerPage } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchArchivesPage = ({ query, page, itemsPerPage } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
