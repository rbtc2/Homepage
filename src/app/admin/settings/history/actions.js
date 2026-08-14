'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import { safeRevalidatePath } from '@/lib/safe-revalidate-path';
import { actionOk, actionFail } from '@/lib/admin-action-result';

const TITLE_MAX = 200;
const DETAIL_MAX = 1000;

function revalidateHistoryPaths() {
  safeRevalidatePath('/history');
  safeRevalidatePath('/admin/settings/history');
}

function normalizePayload(data) {
  const year = Number(data.year);
  const month = Number(data.month);
  const title = String(data.title ?? '').trim();
  const detail = String(data.detail ?? '').trim();

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error('연도를 1900–2100 사이로 입력해 주세요.');
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('월을 1–12 사이로 선택해 주세요.');
  }
  if (!title) throw new Error('내용을 입력해 주세요.');
  if (title.length > TITLE_MAX) {
    throw new Error(`내용은 ${TITLE_MAX}자 이내로 입력해 주세요.`);
  }
  if (detail.length > DETAIL_MAX) {
    throw new Error(`부가 설명은 ${DETAIL_MAX}자 이내로 입력해 주세요.`);
  }

  return { year, month, title, detail };
}

export async function createHistoryEvent(data) {
  try {
    const payload = normalizePayload(data);
    const { error } = await getSupabaseAdmin()
      .from('history_events')
      .insert(payload);

    if (error) return actionFail(error.message);
    revalidateHistoryPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateHistoryEvent(id, data) {
  try {
    const payload = normalizePayload(data);
    const { error } = await getSupabaseAdmin()
      .from('history_events')
      .update(payload)
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);
    revalidateHistoryPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteHistoryEvent(id) {
  try {
    const { error } = await getSupabaseAdmin()
      .from('history_events')
      .delete()
      .eq('id', rowIdForEq(id));

    if (error) return actionFail(error.message);
    revalidateHistoryPaths();
    return actionOk();
  } catch (e) {
    return actionFail(e);
  }
}
