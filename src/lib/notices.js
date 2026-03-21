import { createPostLib } from './db';

const lib = createPostLib('notices', {
  normalizeExtra: (row) => ({ isPinned: row.is_pinned }),
});

export const getNotices = lib.getAll;
export const searchNotices = lib.search;
export const getNoticeById = lib.getById;
export const getPrevNext = lib.getPrevNext;
