'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createPress({
  title,
  sourceName,
  articleUrl,
  publishedAt,
  summary,
  thumbnailUrl,
  content,
  createdAt,
  isFeatured,
}) {
  const { data, error } = await getSupabaseAdmin()
    .from('press_coverage')
    .insert({
      title: title.trim(),
      source_name: sourceName.trim(),
      article_url: articleUrl.trim(),
      published_at: publishedAt ?? today(),
      summary: (summary ?? '').trim(),
      thumbnail_url: thumbnailUrl?.trim() || null,
      content: (content ?? '').trim(),
      author: '관리자',
      created_at: createdAt ?? today(),
      is_featured: Boolean(isFeatured),
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/press');
  return data;
}

export async function updatePress(
  id,
  {
    title,
    sourceName,
    articleUrl,
    publishedAt,
    summary,
    thumbnailUrl,
    content,
    createdAt,
    isFeatured,
  }
) {
  const { data, error } = await getSupabaseAdmin()
    .from('press_coverage')
    .update({
      title: title.trim(),
      source_name: sourceName.trim(),
      article_url: articleUrl.trim(),
      published_at: publishedAt ?? today(),
      summary: (summary ?? '').trim(),
      thumbnail_url: thumbnailUrl?.trim() || null,
      content: (content ?? '').trim(),
      created_at: createdAt ?? today(),
      is_featured: Boolean(isFeatured),
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/press');
  revalidatePath(`/press/${id}`);
  return data;
}

export async function deletePress(id) {
  const { error } = await getSupabaseAdmin()
    .from('press_coverage')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/press');
  revalidatePath(`/press/${id}`);
}

export async function togglePressFeatured(id) {
  const { data: row, error: fetchError } = await getSupabaseAdmin()
    .from('press_coverage')
    .select('is_featured')
    .eq('id', Number(id))
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { data, error } = await getSupabaseAdmin()
    .from('press_coverage')
    .update({ is_featured: !row.is_featured })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/press');
  revalidatePath(`/press/${id}`);
  return data.is_featured;
}
