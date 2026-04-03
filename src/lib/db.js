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
    const viewsNum = Number(row.views);
    return {
      // bigint 등은 RSC→클라이언트 직렬화에 실패할 수 있어 문자열로 통일
      id: row.id == null ? null : String(row.id),
      title: row.title,
      content: row.content,
      author: row.author,
      createdAt: row.created_at,
      views: Number.isFinite(viewsNum) ? viewsNum : 0,
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
   * ILIKE 패턴에서 와일드카드(%,_)와 이스케이프 문자(\)를 이스케이프합니다.
   * 사용자 검색어를 그대로 리터럴 문자열로 매칭하기 위해 사용합니다.
   */
  function escapeLike(str) {
    return str.replace(/[\\%_]/g, '\\$&');
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
    const q = escapeLike(query.trim());
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
      .order('id', { ascending: false })
      .range(from, to);
    if (error) throw new Error(error.message);
    return { items: (data ?? []).map(normalize), totalCount: count ?? 0 };
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
    const numId = Number(id);
    const [prevResult, nextResult] = await Promise.all([
      supabase
        .from(tableName)
        .select('id, title')
        .lt('id', numId)
        .order('id', { ascending: false })
        .limit(1),
      supabase
        .from(tableName)
        .select('id, title')
        .gt('id', numId)
        .order('id', { ascending: true })
        .limit(1),
    ]);

    if (prevResult.error) throw new Error(prevResult.error.message);
    if (nextResult.error) throw new Error(nextResult.error.message);

    return {
      prev: prevResult.data?.[0] ?? null,
      next: nextResult.data?.[0] ?? null,
    };
  }

  return { getAll, getWhere, getPage, searchPage, getById, getPrevNext };
}
