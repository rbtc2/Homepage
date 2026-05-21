'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateNoticePaths(id) {
  safeRevalidatePath('/notices');
  if (id != null && id !== '') safeRevalidatePath(`/notices/${id}`);
  safeRevalidatePath('/');
}

export async function createNotice({ title, content, isPinned, createdAt }) {
  try {
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('notices')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        is_pinned: Boolean(isPinned),
        views: 0,
      });

    if (error) return actionFail(error.message);

    revalidateNoticePaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateNotice(id, { title, content, isPinned, createdAt }) {
  try {
    const idEq = rowIdForEq(id);
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('notices')
      .update({
        title: title.trim(),
        content: contentStored,
        is_pinned: Boolean(isPinned),
        created_at: createdAt ?? today(),
      })
      .eq('id', idEq);

    if (error) return actionFail(error.message);

    revalidateNoticePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteNotice(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin()
      .from('notices')
      .delete()
      .eq('id', idEq);

    if (error) return actionFail(error.message);

    revalidateNoticePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function togglePin(id) {
  try {
    const idEq = rowIdForEq(id);
    const { data: notice, error: fetchError } = await getSupabaseAdmin()
      .from('notices')
      .select('is_pinned')
      .eq('id', idEq)
      .single();

    if (fetchError) return actionFail(fetchError.message);

    const { error } = await getSupabaseAdmin()
      .from('notices')
      .update({ is_pinned: !notice.is_pinned })
      .eq('id', idEq);

    if (error) return actionFail(error.message);

    revalidateNoticePaths(id);
    return { ok: true, isPinned: !notice.is_pinned };
  } catch (e) {
    return actionFail(e);
  }
}
