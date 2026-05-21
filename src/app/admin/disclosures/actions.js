'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateDisclosurePaths(id) {
  safeRevalidatePath('/disclosures');
  if (id != null && id !== '') safeRevalidatePath(`/disclosures/${id}`);
  safeRevalidatePath('/');
}

export async function createDisclosure({ title, content, createdAt }) {
  const { data, error } = await getSupabaseAdmin()
    .from('disclosures')
    .insert({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      views: 0,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  revalidateDisclosurePaths(data?.id != null ? String(data.id) : null);
}

export async function updateDisclosure(id, { title, content, createdAt }) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('disclosures')
    .update({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      created_at: createdAt ?? today(),
    })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateDisclosurePaths(id);
}

export async function deleteDisclosure(id) {
  const idEq = rowIdForEq(id);
  const { data, error } = await getSupabaseAdmin()
    .from('disclosures')
    .delete()
    .eq('id', idEq)
    .select('id');

  if (error) throw new Error(error.message);
  if (!data?.length) {
    throw new Error('삭제할 게시물을 찾을 수 없습니다. 목록을 새로고침한 뒤 다시 시도해 주세요.');
  }

  revalidateDisclosurePaths(id);
}
