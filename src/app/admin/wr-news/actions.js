'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateWrNewsPaths(id) {
  safeRevalidatePath('/wr-news');
  if (id != null && id !== '') safeRevalidatePath(`/wr-news/${id}`);
  safeRevalidatePath('/');
}

export async function createWrNewsPost({ title, content, coverImage, createdAt }) {
  try {
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('wr_news')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        cover_image: coverImage ?? null,
        views: 0,
      });

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateWrNewsPost(id, { title, content, coverImage, createdAt }) {
  try {
    const idEq = rowIdForEq(id);
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('wr_news')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
        cover_image: coverImage ?? null,
      })
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteWrNewsPost(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin()
      .from('wr_news')
      .delete()
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
