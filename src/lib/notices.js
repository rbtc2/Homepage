import { supabase } from './supabase';

function normalize(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: row.created_at,
    isPinned: row.is_pinned,
    views: row.views,
  };
}

export async function getNotices() {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function searchNotices(query) {
  if (!query || !query.trim()) return getNotices();
  const q = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function getNoticeById(id) {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) return null;
  return normalize(data);
}

export async function getPrevNext(id) {
  const { data, error } = await supabase
    .from('notices')
    .select('id, title')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  const numId = Number(id);
  const idx = data.findIndex((n) => n.id === numId);
  return {
    prev: idx > 0 ? data[idx - 1] : null,
    next: idx < data.length - 1 ? data[idx + 1] : null,
  };
}
