'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** PostgREST .eq('id', …) — bigint 문자열·UUID에서 Number() 깨짐 방지 */
function rowIdForEq(id) {
  if (id == null || id === '') throw new Error('잘못된 게시물 식별자입니다.');
  if (typeof id === 'number') {
    if (!Number.isInteger(id) || id < 1) throw new Error('잘못된 게시물 식별자입니다.');
    return id;
  }
  const s = String(id).trim();
  if (!s) throw new Error('잘못된 게시물 식별자입니다.');
  return s;
}

function revalidateDisclosurePaths(id) {
  safeRevalidatePath('/disclosures');
  safeRevalidatePath(`/disclosures/${id}`);
  safeRevalidatePath('/');
}

export async function createDisclosure({ title, content, createdAt }) {
  const { data, error } = await getSupabaseAdmin()
    .from('disclosures')
    .insert({
      title: title.trim(),
      content: content.trim(),
      author: '관리자',
      created_at: createdAt ?? today(),
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidateDisclosurePaths(data.id);
  return data;
}

export async function updateDisclosure(id, { title, content, createdAt }) {
  const { data, error } = await getSupabaseAdmin()
    .from('disclosures')
    .update({
      title: title.trim(),
      content: content.trim(),
      created_at: createdAt ?? today(),
    })
    .eq('id', rowIdForEq(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidateDisclosurePaths(id);
  return data;
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
