'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';

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
  try {
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('press_coverage')
      .insert({
        title: title.trim(),
        source_name: sourceName.trim(),
        article_url: articleUrl.trim(),
        published_at: publishedAt ?? today(),
        summary: (summary ?? '').trim(),
        thumbnail_url: thumbnailUrl?.trim() || null,
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        is_featured: Boolean(isFeatured),
        views: 0,
      });

    if (error) return actionFail(error.message);
    revalidatePressPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
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
  try {
    const idEq = rowIdForEq(id);
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('press_coverage')
      .update({
        title: title.trim(),
        source_name: sourceName.trim(),
        article_url: articleUrl.trim(),
        published_at: publishedAt ?? today(),
        summary: (summary ?? '').trim(),
        thumbnail_url: thumbnailUrl?.trim() || null,
        content: contentStored,
        created_at: createdAt ?? today(),
        is_featured: Boolean(isFeatured),
      })
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidatePressPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deletePress(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin()
      .from('press_coverage')
      .delete()
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidatePressPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function togglePressFeatured(id) {
  try {
    const idEq = rowIdForEq(id);
    const { data: row, error: fetchError } = await getSupabaseAdmin()
      .from('press_coverage')
      .select('is_featured')
      .eq('id', idEq)
      .single();

    if (fetchError) return actionFail(fetchError.message);

    const { error } = await getSupabaseAdmin()
      .from('press_coverage')
      .update({ is_featured: !row.is_featured })
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidatePressPaths(id);
    return { ok: true, isFeatured: !row.is_featured };
  } catch (e) {
    return actionFail(e);
  }
}
