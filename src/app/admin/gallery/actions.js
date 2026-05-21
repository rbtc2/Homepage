'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateGalleryPaths(id) {
  safeRevalidatePath('/gallery');
  if (id != null && id !== '') safeRevalidatePath(`/gallery/${id}`);
  safeRevalidatePath('/');
}

export async function createGalleryPost({ title, content, coverImage, createdAt }) {
  try {
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('gallery')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        cover_image: coverImage ?? null,
        views: 0,
      });

    if (error) return actionFail(error.message);
    revalidateGalleryPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateGalleryPost(id, { title, content, coverImage, createdAt }) {
  try {
    const idEq = rowIdForEq(id);
    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('gallery')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
        cover_image: coverImage ?? null,
      })
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateGalleryPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteGalleryPost(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin()
      .from('gallery')
      .delete()
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateGalleryPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
