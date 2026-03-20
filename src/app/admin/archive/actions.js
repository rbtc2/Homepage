'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createArchive({ title, content, createdAt }) {
  const { data, error } = await supabase
    .from('archive')
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

  revalidatePath('/archive');
  revalidatePath(`/archive/${data.id}`);
  revalidatePath('/');
  return data;
}

export async function updateArchive(id, { title, content, createdAt }) {
  const { data, error } = await supabase
    .from('archive')
    .update({
      title: title.trim(),
      content: content.trim(),
      created_at: createdAt ?? today(),
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/archive');
  revalidatePath(`/archive/${id}`);
  revalidatePath('/');
  return data;
}

export async function deleteArchive(id) {
  const { error } = await supabase
    .from('archive')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/archive');
  revalidatePath('/');
}
