'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidatePressPaths(id) {
  safeRevalidatePath('/press');
  if (id != null && id !== '') safeRevalidatePath(`/press/${id}`);
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
  const { error } = await getSupabaseAdmin()
    .from('press_coverage')
    .insert({
      title: title.trim(),
      source_name: sourceName.trim(),
      article_url: articleUrl.trim(),
      published_at: publishedAt ?? today(),
      summary: (summary ?? '').trim(),
      thumbnail_url: thumbnailUrl?.trim() || null,
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      is_featured: Boolean(isFeatured),
      views: 0,
    });

  if (error) throw new Error(error.message);

  revalidatePressPaths();
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
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('press_coverage')
    .update({
      title: title.trim(),
      source_name: sourceName.trim(),
      article_url: articleUrl.trim(),
      published_at: publishedAt ?? today(),
      summary: (summary ?? '').trim(),
      thumbnail_url: thumbnailUrl?.trim() || null,
      content: preparePostContentForStorage(content),
      created_at: createdAt ?? today(),
      is_featured: Boolean(isFeatured),
    })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidatePressPaths(id);
}

export async function deletePress(id) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('press_coverage')
    .delete()
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidatePressPaths(id);
}

export async function togglePressFeatured(id) {
  const idEq = rowIdForEq(id);
  const { data: row, error: fetchError } = await getSupabaseAdmin()
    .from('press_coverage')
    .select('is_featured')
    .eq('id', idEq)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error } = await getSupabaseAdmin()
    .from('press_coverage')
    .update({ is_featured: !row.is_featured })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidatePressPaths(id);
  return !row.is_featured;
}
