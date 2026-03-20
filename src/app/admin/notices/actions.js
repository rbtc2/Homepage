'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createNotice({ title, content, isPinned, createdAt }) {
  const { data, error } = await supabase
    .from('notices')
    .insert({
      title: title.trim(),
      content: content.trim(),
      author: '관리자',
      created_at: createdAt ?? today(),
      is_pinned: Boolean(isPinned),
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/notices');
  revalidatePath('/');
  return data;
}

export async function updateNotice(id, { title, content, isPinned, createdAt }) {
  const { data, error } = await supabase
    .from('notices')
    .update({
      title: title.trim(),
      content: content.trim(),
      is_pinned: Boolean(isPinned),
      created_at: createdAt ?? today(),
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/notices');
  revalidatePath(`/notices/${id}`);
  revalidatePath('/');
  return data;
}

export async function deleteNotice(id) {
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/notices');
  revalidatePath(`/notices/${id}`);
  revalidatePath('/');
}

export async function togglePin(id) {
  const { data: notice, error: fetchError } = await supabase
    .from('notices')
    .select('is_pinned')
    .eq('id', Number(id))
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { data, error } = await supabase
    .from('notices')
    .update({ is_pinned: !notice.is_pinned })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/notices');
  revalidatePath(`/notices/${id}`);
  revalidatePath('/');
  return data.is_pinned;
}
