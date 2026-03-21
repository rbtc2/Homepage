'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createGalleryPost({ title, content, coverImage, createdAt }) {
  const { data, error } = await supabase
    .from('gallery')
    .insert({
      title: title.trim(),
      content: content.trim(),
      author: '관리자',
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/gallery');
  revalidatePath('/');
  return data;
}

export async function updateGalleryPost(id, { title, content, coverImage, createdAt }) {
  const { data, error } = await supabase
    .from('gallery')
    .update({
      title: title.trim(),
      content: content.trim(),
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${id}`);
  revalidatePath('/');
  return data;
}

export async function deleteGalleryPost(id) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${id}`);
  revalidatePath('/');
}
