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

function revalidateNoticePaths(id) {
  safeRevalidatePath('/notices');
  safeRevalidatePath('/en/notices');
  if (id != null && id !== '') {
    safeRevalidatePath(`/notices/${id}`);
    safeRevalidatePath(`/en/notices/${id}`);
  }
  safeRevalidatePath('/');
  safeRevalidatePath('/en');
}

export async function createNotice({
  title,
  content,
  isPinned,
  createdAt,
  isSecret,
  secretPassword,
}) {
  try {
    const secret = resolveSecretFieldsForCreate({ isSecret, secretPassword });
    if (secret.error) return secret.error;

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('notices')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        is_pinned: Boolean(isPinned),
        views: 0,
        ...secret.fields,
      });

    if (error) return actionFail(error.message);

    revalidateNoticePaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateNotice(
  id,
  { title, content, isPinned, createdAt, isSecret, secretPassword }
) {
  try {
    const secret = await resolveSecretFieldsForUpdate('notices', id, {
      isSecret,
      secretPassword,
    });
    if (secret.error) return secret.error;

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('notices')
      .update({
        title: title.trim(),
        content: contentStored,
        is_pinned: Boolean(isPinned),
        created_at: createdAt ?? today(),
        ...secret.fields,
      })
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);

    revalidateNoticePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateNoticeEnglish(id, { title, content }) {
  try {
    const titleEn = String(title ?? '').trim();
    if (!titleEn) return actionFail('영문 제목을 입력해 주세요.');
    const contentStored = await preparePostContentForStorage(content);
    if (!contentStored || contentStored === '<p></p>') {
      return actionFail('영문 본문을 입력해 주세요.');
    }

    const { error } = await getSupabaseAdmin()
      .from('notices')
      .update({
        title_en: titleEn,
        content_en: contentStored,
      })
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);
    revalidateNoticePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function clearNoticeEnglish(id) {
  try {
    const { error } = await getSupabaseAdmin()
      .from('notices')
      .update({
        title_en: '',
        content_en: '',
      })
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);
    revalidateNoticePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteNotice(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin().from('notices').delete().eq('id', idEq);

    if (error) return actionFail(error.message);

    revalidateNoticePaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function togglePin(id) {
  try {
    const idEq = rowIdForEq(id);
    const { data: notice, error: fetchError } = await getSupabaseAdmin()
      .from('notices')
      .select('is_pinned')
      .eq('id', idEq)
      .single();

    if (fetchError) return actionFail(fetchError.message);

    const { error } = await getSupabaseAdmin()
      .from('notices')
      .update({ is_pinned: !notice.is_pinned })
      .eq('id', idEq);

    if (error) return actionFail(error.message);

    revalidateNoticePaths(id);
    return { ok: true, isPinned: !notice.is_pinned };
  } catch (e) {
    return actionFail(e);
  }
}
