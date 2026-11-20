import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';

const lib = createPostLib('archive', {
  normalizeExtra: (row) => ({
    ...normalizeSecretExtra(row),
    categoryId:
      row.category_id == null || row.category_id === '' ? null : String(row.category_id),
  }),
});

function withCategory(categoryId) {
  if (categoryId == null || categoryId === '') return undefined;
  const id = String(categoryId);
  return (query) => query.eq('category_id', id);
}

export const getArchives = lib.getAll;
export const getArchiveById = lib.getById;
export const getPrevNext = lib.getPrevNext;

export async function getArchiveSecretAuth(id) {
  return getBoardSecretAuth('archive', id);
}

export const getArchivesPage = ({ page, itemsPerPage, categoryId } = {}) =>
  lib.getPage({ page, itemsPerPage, applyFilter: withCategory(categoryId) });

export const searchArchivesPage = ({ query, page, itemsPerPage, categoryId } = {}) =>
  lib.searchPage({ query, page, itemsPerPage, applyFilter: withCategory(categoryId) });
