'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createDisclosure({ title, content, createdAt }) {
  const { data, error } = await supabaseAdmin
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

  revalidatePath('/disclosures');
  revalidatePath(`/disclosures/${data.id}`);
  revalidatePath('/');
  return data;
}

export async function updateDisclosure(id, { title, content, createdAt }) {
  const { data, error } = await supabaseAdmin
    .from('disclosures')
    .update({
      title: title.trim(),
      content: content.trim(),
      created_at: createdAt ?? today(),
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/disclosures');
  revalidatePath(`/disclosures/${id}`);
  revalidatePath('/');
  return data;
}

export async function deleteDisclosure(id) {
  const { error } = await supabaseAdmin
    .from('disclosures')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/disclosures');
  revalidatePath(`/disclosures/${id}`);
  revalidatePath('/');
}
