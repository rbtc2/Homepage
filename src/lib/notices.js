import { createPostLib } from './db';

const lib = createPostLib('notices', {
  normalizeExtra: (row) => ({ isPinned: row.is_pinned }),
});

export const getNotices = lib.getAll;
export const searchNotices = lib.search;
export const getNoticeById = lib.getById;
export const getPrevNext = lib.getPrevNext;

/** 고정 글만 전부 가져옵니다 (보통 소수이므로 LIMIT 없음). */
export const getPinnedNotices = () =>
  lib.getWhere((q) => q.eq('is_pinned', true));

/** 일반 글(비고정)을 DB 레벨 페이지네이션으로 가져옵니다. */
export const getNoticesPage = ({ page, itemsPerPage } = {}) =>
  lib.getPage({ page, itemsPerPage, applyFilter: (q) => q.eq('is_pinned', false) });

/** 전체(고정+일반) 대상으로 DB 레벨 검색 + 페이지네이션. */
export const searchNoticesPage = ({ query, page, itemsPerPage } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
