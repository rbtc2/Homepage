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

function revalidateWrNewsPaths(id) {
  safeRevalidatePath('/wr-news');
  safeRevalidatePath('/en/wr-news');
  if (id != null && id !== '') {
    safeRevalidatePath(`/wr-news/${id}`);
    safeRevalidatePath(`/en/wr-news/${id}`);
  }
  safeRevalidatePath('/');
  safeRevalidatePath('/en');
}

export async function createWrNewsPost({
  title,
  content,
  coverImage,
  createdAt,
  isSecret,
  secretPassword,
}) {
  try {
    const secret = resolveSecretFieldsForCreate({ isSecret, secretPassword });
    if (secret.error) return secret.error;

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('wr_news')
      .insert({
        title: title.trim(),
        content: contentStored,
        author: '관리자',
        created_at: createdAt ?? today(),
        cover_image: coverImage ?? null,
        views: 0,
        ...secret.fields,
      });

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateWrNewsPost(
  id,
  { title, content, coverImage, createdAt, isSecret, secretPassword }
) {
  try {
    const secret = await resolveSecretFieldsForUpdate('wr_news', id, {
      isSecret,
      secretPassword,
    });
    if (secret.error) return secret.error;

    const contentStored = await preparePostContentForStorage(content);
    const { error } = await getSupabaseAdmin()
      .from('wr_news')
      .update({
        title: title.trim(),
        content: contentStored,
        created_at: createdAt ?? today(),
        cover_image: coverImage ?? null,
        ...secret.fields,
      })
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateWrNewsEnglish(id, { title, content }) {
  try {
    const titleEn = String(title ?? '').trim();
    if (!titleEn) return actionFail('영문 제목을 입력해 주세요.');
    const contentStored = await preparePostContentForStorage(content);
    if (!contentStored || contentStored === '<p></p>') {
      return actionFail('영문 본문을 입력해 주세요.');
    }

    const { error } = await getSupabaseAdmin()
      .from('wr_news')
      .update({
        title_en: titleEn,
        content_en: contentStored,
      })
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteWrNewsPost(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin().from('wr_news').delete().eq('id', idEq);

    if (error) return actionFail(error.message);
    revalidateWrNewsPaths(id);
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
