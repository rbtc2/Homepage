'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { actionFail } from '@/lib/admin-action-result';
import { rowIdForEq } from '@/lib/row-id-for-eq';
import {
  duplicateCategoryMessage,
  getArchiveCategoryStateAdmin,
  parseCategoryInput,
  revalidateArchiveBoard,
} from '@/lib/archive-categories';

function okState(state) {
  return { ok: true, state };
}

function failDb(error) {
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`;
  if (error?.code === '23505' || /duplicate key/i.test(message)) {
    if (/name_en/i.test(message)) return actionFail('같은 영어 이름의 분류가 이미 있습니다.');
    return actionFail('같은 이름의 분류가 이미 있습니다.');
  }
  if (
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    /archive_categories|archive_board_settings/i.test(message)
  ) {
    return actionFail('분류 기능을 쓰려면 데이터베이스 마이그레이션을 먼저 적용해 주세요.');
  }
  return actionFail(error?.message || '저장에 실패했습니다.');
}

async function saved() {
  revalidateArchiveBoard();
  const state = await getArchiveCategoryStateAdmin();
  return okState(state);
}

export async function setArchiveCategoriesEnabled(enabled) {
  try {
    const { error } = await getSupabaseAdmin()
      .from('archive_board_settings')
      .upsert(
        {
          id: 1,
          categories_enabled: Boolean(enabled),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    if (error) return failDb(error);
    return saved();
  } catch (e) {
    return actionFail(e);
  }
}

export async function createArchiveCategory({ name, nameEn }) {
  try {
    const parsed = parseCategoryInput({ name, nameEn });
    if (parsed.error) return actionFail(parsed.error);
    const state = await getArchiveCategoryStateAdmin();
    const duplicate = duplicateCategoryMessage(state.categories, parsed);
    if (duplicate) return actionFail(duplicate);
    const sortOrder =
      state.categories.reduce((max, category) => Math.max(max, category.sortOrder), -1) + 1;
    const { error } = await getSupabaseAdmin().from('archive_categories').insert({
      name: parsed.name,
      name_en: parsed.nameEn,
      sort_order: sortOrder,
    });
    if (error) return failDb(error);
    return saved();
  } catch (e) {
    return actionFail(e);
  }
}

export async function updateArchiveCategory(id, { name, nameEn }) {
  try {
    const idEq = rowIdForEq(id);
    const parsed = parseCategoryInput({ name, nameEn });
    if (parsed.error) return actionFail(parsed.error);
    const state = await getArchiveCategoryStateAdmin();
    if (!state.categories.some((category) => category.id === String(idEq))) {
      return actionFail('분류를 찾을 수 없습니다.');
    }
    const duplicate = duplicateCategoryMessage(state.categories, {
      ...parsed,
      exceptId: String(idEq),
    });
    if (duplicate) return actionFail(duplicate);
    const { error } = await getSupabaseAdmin()
      .from('archive_categories')
      .update({ name: parsed.name, name_en: parsed.nameEn })
      .eq('id', idEq);
    if (error) return failDb(error);
    return saved();
  } catch (e) {
    return actionFail(e);
  }
}

export async function deleteArchiveCategory(id) {
  try {
    const idEq = rowIdForEq(id);
    const { error } = await getSupabaseAdmin().from('archive_categories').delete().eq('id', idEq);
    if (error) return failDb(error);
    return saved();
  } catch (e) {
    return actionFail(e);
  }
}

export async function moveArchiveCategory(id, direction) {
  try {
    if (direction !== 'up' && direction !== 'down') return actionFail('순서를 바꿀 수 없습니다.');
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('archive_categories')
      .select('id, sort_order')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });
    if (error) return failDb(error);
    const rows = data ?? [];
    const index = rows.findIndex((row) => String(row.id) === String(id));
    if (index < 0) return actionFail('분류를 찾을 수 없습니다.');
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= rows.length) return saved();
    const next = rows.slice();
    const [item] = next.splice(index, 1);
    next.splice(swapWith, 0, item);
    for (let i = 0; i < next.length; i += 1) {
      const { error: updateError } = await admin
        .from('archive_categories')
        .update({ sort_order: i })
        .eq('id', next[i].id);
      if (updateError) return failDb(updateError);
    }
    return saved();
  } catch (e) {
    return actionFail(e);
  }
}
