import { supabase } from './supabase';
import { ITEMS_PER_PAGE } from './paginate';

function normalize(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    sourceName: row.source_name,
    articleUrl: row.article_url,
    publishedAt: row.published_at,
    summary: row.summary ?? '',
    thumbnailUrl: row.thumbnail_url ?? null,
    content: row.content ?? '',
    author: row.author,
    createdAt: row.created_at,
    views: row.views ?? 0,
    isFeatured: Boolean(row.is_featured),
  };
}

function escapeLike(str) {
  return str.replace(/[\\%_]/g, '\\$&');
}

function orderByDateDesc(q) {
  return q.order('published_at', { ascending: false }).order('id', { ascending: false });
}

/** 대표 노출 글 (목록 1페이지 상단) */
export async function getFeaturedPress() {
  const { data, error } = await orderByDateDesc(
    supabase.from('press_coverage').select('*').eq('is_featured', true)
  );
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

/** 비대표 글만 페이지네이션 */
export async function getPressPage({ page = 1, itemsPerPage = ITEMS_PER_PAGE } = {}) {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  const { data, error, count } = await supabase
    .from('press_coverage')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('published_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  return { items: (data ?? []).map(normalize), totalCount: count ?? 0 };
}

export async function searchPressPage({ query, page = 1, itemsPerPage = ITEMS_PER_PAGE }) {
  if (!query || !query.trim()) return getPressPage({ page, itemsPerPage });
  const q = escapeLike(query.trim());
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  const { data, error, count } = await supabase
    .from('press_coverage')
    .select('*', { count: 'exact' })
    .or(
      `title.ilike.%${q}%,summary.ilike.%${q}%,source_name.ilike.%${q}%,content.ilike.%${q}%`
    )
    .order('published_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  return { items: (data ?? []).map(normalize), totalCount: count ?? 0 };
}

export async function getPressById(id) {
  const { data, error } = await supabase
    .from('press_coverage')
    .select('*')
    .eq('id', Number(id))
    .single();
  if (error) return null;
  return normalize(data);
}

/**
 * 목록 정렬(게재일↓) 기준 인접 글
 * — notices와 동일하게 먼저 "다음 글"(더 최근), 그다음 "이전 글"(더 이전)
 */
export async function getPrevNextPress(id) {
  const current = await getPressById(id);
  if (!current) return { prev: null, next: null };

  const p = current.publishedAt;
  const numId = Number(current.id);

  const { data: sameNewer, error: e1 } = await supabase
    .from('press_coverage')
    .select('id, title')
    .eq('published_at', p)
    .gt('id', numId)
    .order('id', { ascending: true })
    .limit(1);
  if (e1) throw new Error(e1.message);

  let nextRow = sameNewer?.[0] ?? null;
  if (!nextRow) {
    const { data: later, error: e2 } = await supabase
      .from('press_coverage')
      .select('id, title')
      .gt('published_at', p)
      .order('published_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(1);
    if (e2) throw new Error(e2.message);
    nextRow = later?.[0] ?? null;
  }

  const { data: sameOlder, error: e3 } = await supabase
    .from('press_coverage')
    .select('id, title')
    .eq('published_at', p)
    .lt('id', numId)
    .order('id', { ascending: false })
    .limit(1);
  if (e3) throw new Error(e3.message);

  let prevRow = sameOlder?.[0] ?? null;
  if (!prevRow) {
    const { data: earlier, error: e4 } = await supabase
      .from('press_coverage')
      .select('id, title')
      .lt('published_at', p)
      .order('published_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(1);
    if (e4) throw new Error(e4.message);
    prevRow = earlier?.[0] ?? null;
  }

  return { next: nextRow, prev: prevRow };
}

/** 관리자 목록용 전체 */
export async function getAllPress() {
  const { data, error } = await supabase
    .from('press_coverage')
    .select('*')
    .order('published_at', { ascending: false })
    .order('id', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}
