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

export async function getDisclosures() {
  const { data, error } = await supabase
    .from('disclosures')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function searchDisclosures(query) {
  if (!query || !query.trim()) return getDisclosures();
  const q = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from('disclosures')
    .select('*')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function getDisclosureById(id) {
  const { data, error } = await supabase
    .from('disclosures')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) return null;
  return normalize(data);
}

export async function getPrevNext(id) {
  const { data, error } = await supabase
    .from('disclosures')
    .select('id, title')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  const numId = Number(id);
  const idx = data.findIndex((d) => d.id === numId);
  return {
    prev: idx > 0 ? data[idx - 1] : null,
    next: idx < data.length - 1 ? data[idx + 1] : null,
  };
}
