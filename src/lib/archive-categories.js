import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';
import { getSupabaseAdmin } from './supabase-admin';
import { safeRevalidatePath } from './safe-revalidate-path';

export {
  CATEGORY_NAME_MAX,
  CATEGORY_NAME_EN_MAX,
  categoryLabel,
  visibleCategoryLabel,
  archivePublicPath,
  parseCategoryInput,
  duplicateCategoryMessage,
} from './archive-category-shared';

const EMPTY_STATE = { enabled: false, categories: [] };

function isMissingSchema(error) {
  const code = error?.code ?? '';
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`;
  return (
    code === '42P01' ||
    code === '42703' ||
    code === 'PGRST205' ||
    /archive_board_settings|archive_categories|category_id/i.test(message)
  );
}

function mapCategory(row, counts) {
  const id = String(row.id);
  return {
    id,
    name: String(row.name ?? ''),
    nameEn: String(row.name_en ?? ''),
    sortOrder: Number(row.sort_order) || 0,
    postCount: counts?.get(id) ?? 0,
  };
}

async function fetchState(client, { withCounts = false } = {}) {
  const [settingsRes, categoriesRes] = await Promise.all([
    client
      .from('archive_board_settings')
      .select('categories_enabled')
      .eq('id', 1)
      .maybeSingle(),
    client
      .from('archive_categories')
      .select('id, name, name_en, sort_order')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true }),
  ]);

  if (settingsRes.error) {
    if (isMissingSchema(settingsRes.error)) {
      console.error('[archive-categories]', settingsRes.error.message);
      return EMPTY_STATE;
    }
    throw new Error(settingsRes.error.message);
  }
  if (categoriesRes.error) {
    if (isMissingSchema(categoriesRes.error)) {
      console.error('[archive-categories]', categoriesRes.error.message);
      return EMPTY_STATE;
    }
    throw new Error(categoriesRes.error.message);
  }

  let counts = null;
  if (withCounts) {
    const { data, error } = await client
      .from('archive')
      .select('category_id')
      .not('category_id', 'is', null);
    if (error) {
      if (!isMissingSchema(error)) throw new Error(error.message);
    } else {
      counts = new Map();
      for (const row of data ?? []) {
        if (row.category_id == null) continue;
        const key = String(row.category_id);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }

  return {
    enabled: Boolean(settingsRes.data?.categories_enabled),
    categories: (categoriesRes.data ?? []).map((row) => mapCategory(row, counts)),
  };
}

/** 공개 페이지용. 테이블이 아직 없으면 분류 없음으로 본다. */
export function getArchiveCategoryState({ withCounts = false } = {}) {
  return fetchState(supabase, { withCounts });
}

/** 관리자 저장 직후 조회. 글 수를 포함한다. */
export function getArchiveCategoryStateAdmin() {
  return fetchState(getSupabaseAdmin(), { withCounts: true });
}

export function revalidateArchiveBoard(id) {
  safeRevalidatePath('/archive');
  safeRevalidatePath('/en/archive');
  safeRevalidatePath('/');
  if (id != null && id !== '') {
    safeRevalidatePath(`/archive/${id}`);
    safeRevalidatePath(`/en/archive/${id}`);
  }
  try {
    revalidatePath('/archive/[id]', 'page');
    revalidatePath('/en/archive/[id]', 'page');
  } catch (e) {
    console.error('[revalidateArchiveBoard]', e);
  }
}
