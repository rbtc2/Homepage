import { supabase } from './supabase';
import { createPostLib } from './db';

const lib = createPostLib('gallery', {
  normalizeExtra: (row) => ({ coverImage: row.cover_image ?? null }),
});

export const getGalleryPosts = lib.getAll;
export const getGalleryById  = lib.getById;
export const getGalleryPrevNext = lib.getPrevNext;

const GALLERY_PER_PAGE = 12;

/** 연도 필터 지원 페이지네이션 */
export const getGalleryPage = ({ page = 1, itemsPerPage = GALLERY_PER_PAGE, year } = {}) =>
  lib.getPage({
    page,
    itemsPerPage,
    applyFilter: year ? (q) => q.like('created_at', `${year}%`) : undefined,
  });

/** 검색 + 페이지네이션 */
export const searchGalleryPage = ({ query, page, itemsPerPage = GALLERY_PER_PAGE } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });

/** 최신 n개 (Hero 섹션용) */
export async function getLatestGallery(n = 3) {
  const { items } = await lib.getPage({ page: 1, itemsPerPage: n });
  return items;
}

/** DB에 존재하는 연도 목록 (내림차순) */
export async function getGalleryYears() {
  const { data, error } = await supabase
    .from('gallery')
    .select('created_at')
    .order('created_at', { ascending: false });

  if (error) return [];
  const years = [...new Set((data ?? []).map((r) => r.created_at.slice(0, 4)))];
  return years.sort((a, b) => Number(b) - Number(a));
}
