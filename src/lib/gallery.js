import { supabase } from './supabase';
import { createPostLib } from './db';
import { getBoardSecretAuth, normalizeSecretExtra } from './secret-post';

function hasEnglishFields(titleEn, contentEn) {
  return Boolean(String(titleEn ?? '').trim() && String(contentEn ?? '').trim());
}

const lib = createPostLib('gallery', {
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

export function localizeGalleryPost(post, locale = 'ko') {
  if (!post) return null;
  if (locale !== 'en' || !post.hasEnglish) return post;
  return {
    ...post,
    title: post.titleEn,
    content: post.contentEn,
  };
}

export function localizeGalleryPosts(posts, locale = 'ko') {
  return (posts ?? []).map((post) => localizeGalleryPost(post, locale));
}

export const getGalleryPosts = lib.getAll;
export const getGalleryById = lib.getById;

export async function getGalleryPrevNext(id, locale = 'ko') {
  const numId = Number(id);
  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('gallery')
      .select('id, title, title_en, content_en')
      .lt('id', numId)
      .order('id', { ascending: false })
      .limit(1),
    supabase
      .from('gallery')
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

export async function getGallerySecretAuth(id) {
  return getBoardSecretAuth('gallery', id);
}

const GALLERY_PER_PAGE = 12;

export const getGalleryPage = ({ page = 1, itemsPerPage = GALLERY_PER_PAGE, year } = {}) =>
  lib.getPage({
    page,
    itemsPerPage,
    applyFilter: year ? (q) => q.like('created_at', `${year}%`) : undefined,
  });

export const searchGalleryPage = ({ query, page, itemsPerPage = GALLERY_PER_PAGE } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });

export async function getLatestGallery(n = 3) {
  const { items } = await lib.getPage({ page: 1, itemsPerPage: n });
  return items;
}

export async function getGalleryYears() {
  const { data, error } = await supabase
    .from('gallery')
    .select('created_at')
    .order('created_at', { ascending: false });

  if (error) return [];
  const years = [...new Set((data ?? []).map((r) => r.created_at.slice(0, 4)))];
  return years.sort((a, b) => Number(b) - Number(a));
}
