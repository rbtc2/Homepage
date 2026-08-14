import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';

const lib = createPostLib('wr_news', {
  normalizeExtra: (row) => ({
    coverImage: row.cover_image ?? null,
    ...normalizeSecretExtra(row),
  }),
});

export const getWrNewsPosts = lib.getAll;
export const getWrNewsById = lib.getById;
export const getWrNewsPrevNext = lib.getPrevNext;

export async function getWrNewsSecretAuth(id) {
  return getBoardSecretAuth('wr_news', id);
}

const WR_NEWS_PER_PAGE = 12;

export const getWrNewsPage = ({ page = 1, itemsPerPage = WR_NEWS_PER_PAGE } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchWrNewsPage = ({ query, page, itemsPerPage = WR_NEWS_PER_PAGE } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
