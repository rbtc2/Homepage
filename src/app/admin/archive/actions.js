'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { hashSecretPassword } from '@/lib/secret-password';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createArchive({ title, content, createdAt, isSecret, secretPassword }) {
  const secretEnabled = Boolean(isSecret);
  const normalizedPassword = String(secretPassword ?? '').trim();
  if (secretEnabled && !normalizedPassword) {
    throw new Error('비밀글 비밀번호를 입력해 주세요.');
  }

  const { data, error } = await getSupabaseAdmin()
    .from('archive')
    .insert({
      title: title.trim(),
      content: content.trim(),
      author: '관리자',
      created_at: createdAt ?? today(),
      views: 0,
      is_secret: secretEnabled,
      secret_password_hash: secretEnabled ? hashSecretPassword(normalizedPassword) : null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/archive');
  revalidatePath(`/archive/${data.id}`);
  revalidatePath('/');
  return data;
}

export async function updateArchive(id, { title, content, createdAt, isSecret, secretPassword }) {
  const archiveId = Number(id);
  const secretEnabled = Boolean(isSecret);
  const normalizedPassword = String(secretPassword ?? '').trim();

  let nextSecretHash = null;
  if (secretEnabled) {
    if (normalizedPassword) {
      nextSecretHash = hashSecretPassword(normalizedPassword);
    } else {
      const { data: current, error: currentError } = await getSupabaseAdmin()
        .from('archive')
        .select('secret_password_hash')
        .eq('id', archiveId)
        .single();
      if (currentError) throw new Error(currentError.message);
      if (!current?.secret_password_hash) {
        throw new Error('비밀글 비밀번호를 입력해 주세요.');
      }
      nextSecretHash = current.secret_password_hash;
    }
  }

  const { data, error } = await getSupabaseAdmin()
    .from('archive')
    .update({
      title: title.trim(),
      content: content.trim(),
      created_at: createdAt ?? today(),
      is_secret: secretEnabled,
      secret_password_hash: nextSecretHash,
    })
    .eq('id', archiveId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/archive');
  revalidatePath(`/archive/${id}`);
  revalidatePath('/');
  return data;
}

export async function deleteArchive(id) {
  const { error } = await getSupabaseAdmin()
    .from('archive')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);

  revalidatePath('/archive');
  revalidatePath(`/archive/${id}`);
  revalidatePath('/');
}
