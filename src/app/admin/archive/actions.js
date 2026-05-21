'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { hashSecretPassword } from '@/lib/secret-password';
import { actionOk, actionFail } from '@/lib/admin-action-result';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateArchivePaths(id) {
  safeRevalidatePath('/archive');
  if (id != null && id !== '') safeRevalidatePath(`/archive/${id}`);
  safeRevalidatePath('/');
}

export async function createArchive({ title, content, createdAt, isSecret, secretPassword }) {
  try {
    const secretEnabled = Boolean(isSecret);
    const normalizedPassword = String(secretPassword ?? '').trim();
    if (secretEnabled && !normalizedPassword) {
      return actionFail('비밀글 비밀번호를 입력해 주세요.');
    }

    const contentStored = await preparePostContentForStorage(content);
    const { data, error } = await getSupabaseAdmin()
      .from('archive')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        views: 0,
        is_secret: secretEnabled,
        secret_password_hash: secretEnabled ? hashSecretPassword(normalizedPassword) : null,
      })
      .select('id')
      .single();

    if (error) return actionFail(error.message);

    revalidateArchivePaths(data?.id != null ? String(data.id) : null);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateArchive(id, { title, content, createdAt, isSecret, secretPassword }) {
  try {
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
        if (currentError) return actionFail(currentError.message);
        if (!current?.secret_password_hash) {
          return actionFail('비밀글 비밀번호를 입력해 주세요.');
        }
        nextSecretHash = current.secret_password_hash;
      }
    }

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('archive')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
        is_secret: secretEnabled,
        secret_password_hash: nextSecretHash,
      })
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateArchivePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteArchive(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin()
      .from('archive')
      .delete()
      .eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateArchivePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
