'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateDisclosurePaths(id) {
  safeRevalidatePath('/disclosures');
  if (id != null && id !== '') safeRevalidatePath(`/disclosures/${id}`);
  safeRevalidatePath('/');
}

export async function createDisclosure({ title, content, createdAt }) {
  try {
    const contentStored = await preparePostContentForStorage(content);
    const { data, error } = await getSupabaseAdmin()
      .from('disclosures')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        views: 0,
      })
      .select('id')
      .single();

    if (error) return actionFail(error.message);
    revalidateDisclosurePaths(data?.id != null ? String(data.id) : null);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateDisclosure(id, { title, content, createdAt }) {
  try {
    const idEq = rowIdForEq(id);
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('disclosures')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
      })
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateDisclosurePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteDisclosure(id) {
  try {
    const idEq = rowIdForEq(id);
    const { data, error } = await getSupabaseAdmin()
      .from('disclosures')
      .delete()
      .eq('id', idEq)
      .select('id');

    if (error) return actionFail(error.message);
    if (!data?.length) {
      return actionFail('삭제할 게시물을 찾을 수 없습니다. 목록을 새로고침한 뒤 다시 시도해 주세요.');
    }

    revalidateDisclosurePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
