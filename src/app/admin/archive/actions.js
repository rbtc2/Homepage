'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { hashSecretPassword } from '@/lib/secret-password';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateArchivePaths(id) {
  safeRevalidatePath('/archive');
  if (id != null && id !== '') safeRevalidatePath(`/archive/${id}`);
  safeRevalidatePath('/');
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
      content: preparePostContentForStorage(content),
      author: '관리자',
      created_at: createdAt ?? today(),
      views: 0,
      is_secret: secretEnabled,
      secret_password_hash: secretEnabled ? hashSecretPassword(normalizedPassword) : null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  revalidateArchivePaths(data?.id != null ? String(data.id) : null);
}

export async function updateArchive(id, { title, content, createdAt, isSecret, secretPassword }) {
  const idEq = rowIdForEq(id);
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
        .eq('id', idEq)
        .single();
      if (currentError) throw new Error(currentError.message);
      if (!current?.secret_password_hash) {
        throw new Error('비밀글 비밀번호를 입력해 주세요.');
      }
      nextSecretHash = current.secret_password_hash;
    }
  }

  const { error } = await getSupabaseAdmin()
    .from('archive')
    .update({
      title: title.trim(),
      content: preparePostContentForStorage(content),
      created_at: createdAt ?? today(),
      is_secret: secretEnabled,
      secret_password_hash: nextSecretHash,
    })
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateArchivePaths(id);
}

export async function deleteArchive(id) {
  const idEq = rowIdForEq(id);
  const { error } = await getSupabaseAdmin()
    .from('archive')
    .delete()
    .eq('id', idEq);

  if (error) throw new Error(error.message);

  revalidateArchivePaths(id);
}
