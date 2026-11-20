'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { preparePostContentForStorage } from '@/lib/post-content';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { actionOk, actionFail } from '@/lib/admin-action-result';
import {
  resolveSecretFieldsForCreate,
  resolveSecretFieldsForUpdate,
} from '@/lib/secret-post';
import {
  getArchiveCategoryStateAdmin,
  revalidateArchiveBoard,
} from '@/lib/archive-categories';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateArchivePaths(id) {
  revalidateArchiveBoard(id);
}

async function resolveArchiveCategoryField(categoryId) {
  if (categoryId === undefined) return { fields: {} };
  const state = await getArchiveCategoryStateAdmin();
  if (!state.enabled || state.categories.length === 0) return { fields: {} };
  if (categoryId == null || categoryId === '') return { fields: { category_id: null } };
  const id = String(categoryId);
  if (!state.categories.some((category) => category.id === id)) {
    return { error: actionFail('선택한 분류를 찾을 수 없습니다.') };
  }
  return { fields: { category_id: id } };
}

export async function createArchive({ title, content, createdAt, isSecret, secretPassword, categoryId }) {
  try {
    const secret = resolveSecretFieldsForCreate({ isSecret, secretPassword });
    if (secret.error) return secret.error;
    const category = await resolveArchiveCategoryField(categoryId);
    if (category.error) return category.error;

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
        ...category.fields,
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

export async function updateArchive(id, { title, content, createdAt, isSecret, secretPassword, categoryId }) {
  try {
    const secret = await resolveSecretFieldsForUpdate('archive', id, {
      isSecret,
      secretPassword,
    });
    if (secret.error) return secret.error;
    const category = await resolveArchiveCategoryField(categoryId);
    if (category.error) return category.error;

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('archive')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
        ...secret.fields,
        ...category.fields,
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
