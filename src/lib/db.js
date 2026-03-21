import { supabase } from './supabase';

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

  return { getAll, search, getById, getPrevNext };
}
