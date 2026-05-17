'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { revalidatePath } from 'next/cache';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createWrNewsPost({ title, content, coverImage, createdAt }) {
  const { data, error } = await getSupabaseAdmin()
    .from('wr_news')
    .insert({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/wr-news');
  revalidatePath('/');
  return data;
}

export async function updateWrNewsPost(id, { title, content, coverImage, createdAt }) {
  const { data, error } = await getSupabaseAdmin()
    .from('wr_news')
    .update({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      created_at: createdAt ?? today(),
      cover_image: coverImage ?? null,
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/wr-news');
  revalidatePath(`/wr-news/${id}`);
  revalidatePath('/');
  return data;
}

export async function deleteWrNewsPost(id) {
  const { error } = await getSupabaseAdmin()
    .from('wr_news')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/wr-news');
  revalidatePath(`/wr-news/${id}`);
  revalidatePath('/');
}
