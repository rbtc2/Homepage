import { supabase } from './supabase';

function normalize(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: row.created_at,
    views: row.views,
  };
}

export async function getArchives() {
  const { data, error } = await supabase
    .from('archive')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function searchArchives(query) {
  if (!query || !query.trim()) return getArchives();
  const q = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from('archive')
    .select('*')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function getArchiveById(id) {
  const { data, error } = await supabase
    .from('archive')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) return null;
  return normalize(data);
}

export async function getPrevNext(id) {
  const { data, error } = await supabase
    .from('archive')
    .select('id, title')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  const numId = Number(id);
  const idx = data.findIndex((a) => a.id === numId);
  return {
    prev: idx > 0 ? data[idx - 1] : null,
    next: idx < data.length - 1 ? data[idx + 1] : null,
  };
}
