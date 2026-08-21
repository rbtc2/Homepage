import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';
import { supabase } from './supabase';

function hasEnglishFields(titleEn, contentEn) {
  return Boolean(String(titleEn ?? '').trim() && String(contentEn ?? '').trim());
}

const lib = createPostLib('wr_news', {
  searchFields: ['title', 'content', 'title_en', 'content_en'],
  normalizeExtra: (row) => {
    const titleEn = row.title_en ?? '';
    const contentEn = row.content_en ?? '';
    return {
      coverImage: row.cover_image ?? null,
      titleEn,
      contentEn,
      hasEnglish: hasEnglishFields(titleEn, contentEn),
      ...normalizeSecretExtra(row),
    };
  },
});

export function hasWrNewsEnglish(post) {
  return Boolean(post?.hasEnglish);
}

/** 영문 사이트: 영문 제목·본문이 둘 다 있으면 그 값, 없으면 한국어 */
export function localizeWrNewsPost(post, locale = 'ko') {
  if (!post) return null;
  if (locale !== 'en' || !hasWrNewsEnglish(post)) return post;
  return {
    ...post,
    title: post.titleEn,
    content: post.contentEn,
  };
}

export function localizeWrNewsPosts(posts, locale = 'ko') {
  return (posts ?? []).map((post) => localizeWrNewsPost(post, locale));
}

export const getWrNewsPosts = lib.getAll;
export const getWrNewsById = lib.getById;

export async function getWrNewsPrevNext(id, locale = 'ko') {
  const numId = Number(id);
  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('wr_news')
      .select('id, title, title_en, content_en')
      .lt('id', numId)
      .order('id', { ascending: false })
      .limit(1),
    supabase
      .from('wr_news')
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

export async function getWrNewsSecretAuth(id) {
  return getBoardSecretAuth('wr_news', id);
}

const WR_NEWS_PER_PAGE = 12;

export const getWrNewsPage = ({ page = 1, itemsPerPage = WR_NEWS_PER_PAGE } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchWrNewsPage = ({ query, page, itemsPerPage = WR_NEWS_PER_PAGE } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
