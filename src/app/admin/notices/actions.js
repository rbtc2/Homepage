'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateNoticePaths(id) {
  safeRevalidatePath('/notices');
  if (id != null && id !== '') safeRevalidatePath(`/notices/${id}`);
  safeRevalidatePath('/');
}

export async function createNotice({ title, content, isPinned, createdAt }) {
  const { error } = await getSupabaseAdmin()
    .from('notices')
    .insert({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      is_pinned: Boolean(isPinned),
      views: 0,
    });

  if (error) throw new Error(error.message);

  revalidateNoticePaths();
}

export async function updateNotice(id, { title, content, isPinned, createdAt }) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('notices')
    .update({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      is_pinned: Boolean(isPinned),
      created_at: createdAt ?? today(),
    })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateNoticePaths(id);
}

export async function deleteNotice(id) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('notices')
    .delete()
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateNoticePaths(id);
}

export async function togglePin(id) {
  const idEq = rowIdForEq(id);
  const { data: notice, error: fetchError } = await getSupabaseAdmin()
    .from('notices')
    .select('is_pinned')
    .eq('id', idEq)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error } = await getSupabaseAdmin()
    .from('notices')
    .update({ is_pinned: !notice.is_pinned })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateNoticePaths(id);
  return !notice.is_pinned;
}
