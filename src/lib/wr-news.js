import { createPostLib } from './db';

const lib = createPostLib('wr_news', {
  normalizeExtra: (row) => ({ coverImage: row.cover_image ?? null }),
});

export const getWrNewsPosts = lib.getAll;
export const getWrNewsById = lib.getById;
export const getWrNewsPrevNext = lib.getPrevNext;

const WR_NEWS_PER_PAGE = 12;

export const getWrNewsPage = ({ page = 1, itemsPerPage = WR_NEWS_PER_PAGE } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchWrNewsPage = ({ query, page, itemsPerPage = WR_NEWS_PER_PAGE } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
