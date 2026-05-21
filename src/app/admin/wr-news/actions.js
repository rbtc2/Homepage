'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateWrNewsPaths(id) {
  safeRevalidatePath('/wr-news');
  if (id != null && id !== '') safeRevalidatePath(`/wr-news/${id}`);
  safeRevalidatePath('/');
}

export async function createWrNewsPost({ title, content, coverImage, createdAt }) {
  const { error } = await getSupabaseAdmin()
    .from('wr_news')
    .insert({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
      views: 0,
    });

  if (error) throw new Error(error.message);

  revalidateWrNewsPaths();
}

export async function updateWrNewsPost(id, { title, content, coverImage, createdAt }) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('wr_news')
    .update({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
    })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateWrNewsPaths(id);
}

export async function deleteWrNewsPost(id) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('wr_news')
    .delete()
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateWrNewsPaths(id);
}
