'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';
import {
  resolveSecretFieldsForCreate,
  resolveSecretFieldsForUpdate,
} from '@/lib/secret-post';

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
    const secret = resolveSecretFieldsForCreate({ isSecret, secretPassword });
    if (secret.error) return secret.error;

    const contentStored = await preparePostContentForStorage(content);
    const { data, error } = await getSupabaseAdmin()
      .from('archive')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        views: 0,
        ...secret.fields,
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
    const secret = await resolveSecretFieldsForUpdate('archive', id, {
      isSecret,
      secretPassword,
    });
    if (secret.error) return secret.error;

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('archive')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
        ...secret.fields,
      })
      .eq('id', rowIdForEq(id));

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
    const { error } = await getSupabaseAdmin().from('archive').delete().eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateArchivePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
