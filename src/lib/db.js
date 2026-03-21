import { supabase } from './supabase';

const ITEMS_PER_PAGE = 10;

/**
 * 게시판 테이블 공통 CRUD 유틸 팩토리.
 * @param {string} tableName - Supabase 테이블 이름
 * @param {{ normalizeExtra?: (row: object) => object }} options
 */
export function createPostLib(tableName, { normalizeExtra } = {}) {
  function normalize(row) {
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      author: row.author,
      createdAt: row.created_at,
      views: row.views,
      ...normalizeExtra?.(row),
    };
  }

  async function getAll() {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('id', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(normalize);
  }

  /**
   * 필터 조건에 맞는 전체 행을 반환합니다 (소량 데이터 전용).
   * @param {(q: object) => object} applyFilter
   */
  async function getWhere(applyFilter) {
    let q = supabase.from(tableName).select('*').order('id', { ascending: false });
    if (applyFilter) q = applyFilter(q);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalize);
  }

  /**
   * DB 레벨 페이지네이션 — 필요한 페이지 분량만 조회합니다.
   * @param {{ page?: number, itemsPerPage?: number, applyFilter?: (q: object) => object }} options
   * @returns {{ items: object[], totalCount: number }}
   */
  async function getPage({ page = 1, itemsPerPage = ITEMS_PER_PAGE, applyFilter } = {}) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    let q = supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('id', { ascending: false })
      .range(from, to);
    if (applyFilter) q = applyFilter(q);
    const { data, error, count } = await q;
    if (error) throw new Error(error.message);
    return { items: (data ?? []).map(normalize), totalCount: count ?? 0 };
  }

  /**
   * DB 레벨 검색 + 페이지네이션.
   * @param {{ query: string, page?: number, itemsPerPage?: number }} options
   * @returns {{ items: object[], totalCount: number }}
   */
  async function searchPage({ query, page = 1, itemsPerPage = ITEMS_PER_PAGE }) {
    if (!query || !query.trim()) return getPage({ page, itemsPerPage });
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    const q = query.trim();
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
      .order('id', { ascending: false })
      .range(from, to);
    if (error) throw new Error(error.message);
    return { items: (data ?? []).map(normalize), totalCount: count ?? 0 };
  }

  async function search(query) {
    if (!query || !query.trim()) return getAll();
    const q = query.trim().toLowerCase();

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
      .order('id', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(normalize);
  }

  async function getById(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error) return null;
    return normalize(data);
  }

  async function getPrevNext(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('id, title')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    const numId = Number(id);
    const idx = data.findIndex((r) => r.id === numId);
    return {
      prev: idx > 0 ? data[idx - 1] : null,
      next: idx < data.length - 1 ? data[idx + 1] : null,
    };
  }

  return { getAll, getWhere, getPage, search, searchPage, getById, getPrevNext };
}
