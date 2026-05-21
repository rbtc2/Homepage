'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateGalleryPaths(id) {
  safeRevalidatePath('/gallery');
  if (id != null && id !== '') safeRevalidatePath(`/gallery/${id}`);
  safeRevalidatePath('/');
}

export async function createGalleryPost({ title, content, coverImage, createdAt }) {
  const { error } = await getSupabaseAdmin()
    .from('gallery')
    .insert({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
      views: 0,
    });

  if (error) throw new Error(error.message);

  revalidateGalleryPaths();
}

export async function updateGalleryPost(id, { title, content, coverImage, createdAt }) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('gallery')
    .update({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
    })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateGalleryPaths(id);
}

export async function deleteGalleryPost(id) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('gallery')
    .delete()
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateGalleryPaths(id);
}
