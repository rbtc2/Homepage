import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';
import { supabase } from './supabase';

function hasEnglishFields(titleEn, contentEn) {
  return Boolean(String(titleEn ?? '').trim() && String(contentEn ?? '').trim());
}

const lib = createPostLib('notices', {
  select:
    'id, title, content, author, created_at, views, is_pinned, title_en, content_en, is_secret, category_id',
  searchFields: ['title', 'content', 'title_en', 'content_en'],
  normalizeExtra: (row) => {
    const titleEn = row.title_en ?? '';
    const contentEn = row.content_en ?? '';
    return {
      isPinned: row.is_pinned,
      titleEn,
      contentEn,
      hasEnglish: hasEnglishFields(titleEn, contentEn),
      categoryId:
        row.category_id == null || row.category_id === '' ? null : String(row.category_id),
      ...normalizeSecretExtra(row),
    };
  },
});

export function hasNoticeEnglish(post) {
  return Boolean(post?.hasEnglish);
}

/** 영문 사이트: 영문 제목·본문이 둘 다 있으면 그 값, 없으면 한국어 */
export function localizeNotice(post, locale = 'ko') {
  if (!post) return null;
  if (locale !== 'en' || !hasNoticeEnglish(post)) return post;
  return {
    ...post,
    title: post.titleEn,
    content: post.contentEn,
  };
}

export function localizeNotices(posts, locale = 'ko') {
  return (posts ?? []).map((post) => localizeNotice(post, locale));
}

export const getNotices = lib.getAll;
export const getNoticeById = lib.getById;

export async function getPrevNext(id, locale = 'ko') {
  const numId = Number(id);
  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('notices')
      .select('id, title, title_en, content_en')
      .lt('id', numId)
      .order('id', { ascending: false })
      .limit(1),
    supabase
      .from('notices')
      .select('id, title, title_en, content_en')
      .gt('id', numId)
      .order('id', { ascending: true })
      .limit(1),
  ]);

  if (prevResult.error || nextResult.error) {
    return lib.getPrevNext(id);
  }

  const sibling = (row) => {
    if (!row) return null;
    const useEn = locale === 'en' && hasEnglishFields(row.title_en, row.content_en);
    return {
      id: String(row.id),
      title: useEn ? row.title_en : row.title,
    };
  };

  return {
    prev: sibling(prevResult.data?.[0]),
    next: sibling(nextResult.data?.[0]),
  };
}

export async function getNoticeSecretAuth(id) {
  return getBoardSecretAuth('notices', id);
}

/** 고정 여부(pinned)와 분류(categoryId)로 거르는 쿼리 조건. 둘 다 없으면 undefined. */
function noticeFilter({ pinned, categoryId } = {}) {
  const hasCategory = categoryId != null && categoryId !== '';
  if (pinned === undefined && !hasCategory) return undefined;
  return (query) => {
    let next = query;
    if (pinned !== undefined) next = next.eq('is_pinned', pinned);
    if (hasCategory) next = next.eq('category_id', String(categoryId));
    return next;
  };
}

export const getPinnedNotices = ({ categoryId } = {}) =>
  lib.getWhere(noticeFilter({ pinned: true, categoryId }));

export const getNoticesPage = ({ page, itemsPerPage, categoryId } = {}) =>
  lib.getPage({
    page,
    itemsPerPage,
    applyFilter: noticeFilter({ pinned: false, categoryId }),
  });

export const searchNoticesPage = ({ query, page, itemsPerPage, categoryId } = {}) =>
  lib.searchPage({ query, page, itemsPerPage, applyFilter: noticeFilter({ categoryId }) });
