import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';
import { getSupabaseAdmin } from './supabase-admin';
import { safeRevalidatePath } from './safe-revalidate-path';
import { actionFail } from './admin-action-result';

/**
 * 카테고리(말머리)를 쓰는 게시판 설정.
 * 새 게시판에 붙일 때는 여기에 항목을 추가하고, 같은 구조의 테이블 마이그레이션을 만든다.
 */
export const BOARD_CATEGORY_CONFIG = {
  archive: {
    label: '자료실',
    postTable: 'archive',
    settingsTable: 'archive_board_settings',
    categoriesTable: 'archive_categories',
    paths: ['/archive', '/en/archive'],
    extraPaths: ['/'],
  },
  notices: {
    label: '공지사항',
    postTable: 'notices',
    settingsTable: 'notices_board_settings',
    categoriesTable: 'notices_categories',
    paths: ['/notices', '/en/notices'],
    extraPaths: ['/', '/en'],
  },
};

const EMPTY_STATE = { enabled: false, categories: [] };

export function resolveBoardConfig(board) {
  return Object.hasOwn(BOARD_CATEGORY_CONFIG, board) ? BOARD_CATEGORY_CONFIG[board] : null;
}

function requireBoardConfig(board) {
  const config = resolveBoardConfig(board);
  if (!config) throw new Error('알 수 없는 게시판입니다.');
  return config;
}

export function isMissingCategorySchema(error) {
  const code = error?.code ?? '';
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`;
  return (
    code === '42P01' ||
    code === '42703' ||
    code === 'PGRST205' ||
    /_board_settings|_categories|category_id/i.test(message)
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

async function fetchState(client, config, { withCounts = false } = {}) {
  const [settingsRes, categoriesRes] = await Promise.all([
    client
      .from(config.settingsTable)
      .select('categories_enabled')
      .eq('id', 1)
      .maybeSingle(),
    client
      .from(config.categoriesTable)
      .select('id, name, name_en, sort_order')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true }),
  ]);

  for (const result of [settingsRes, categoriesRes]) {
    if (!result.error) continue;
    if (isMissingCategorySchema(result.error)) {
      console.error(`[board-categories:${config.postTable}]`, result.error.message);
      return EMPTY_STATE;
    }
    throw new Error(result.error.message);
  }

  let counts = null;
  if (withCounts) {
    const { data, error } = await client
      .from(config.postTable)
      .select('category_id')
      .not('category_id', 'is', null);
    if (error) {
      if (!isMissingCategorySchema(error)) throw new Error(error.message);
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
export function getBoardCategoryState(board, { withCounts = false } = {}) {
  return fetchState(supabase, requireBoardConfig(board), { withCounts });
}

/** 관리자 저장 직후 조회. 글 수를 포함한다. */
export function getBoardCategoryStateAdmin(board) {
  return fetchState(getSupabaseAdmin(), requireBoardConfig(board), { withCounts: true });
}

/**
 * 글 저장 시 category_id 필드를 정한다.
 * - categoryId 가 undefined 이면 건드리지 않는다.
 * - 토글이 꺼져 있거나 분류가 없으면 건드리지 않는다.
 */
export async function resolveBoardCategoryField(board, categoryId) {
  if (categoryId === undefined) return { fields: {} };
  const state = await getBoardCategoryStateAdmin(board);
  if (!state.enabled || state.categories.length === 0) return { fields: {} };
  if (categoryId == null || categoryId === '') return { fields: { category_id: null } };
  const id = String(categoryId);
  if (!state.categories.some((category) => category.id === id)) {
    return { error: actionFail('선택한 분류를 찾을 수 없습니다.') };
  }
  return { fields: { category_id: id } };
}

export function revalidateBoardCategories(board, id) {
  const config = requireBoardConfig(board);
  for (const path of config.paths) {
    safeRevalidatePath(path);
    if (id != null && id !== '') safeRevalidatePath(`${path}/${id}`);
  }
  for (const path of config.extraPaths) safeRevalidatePath(path);
  try {
    for (const path of config.paths) revalidatePath(`${path}/[id]`, 'page');
  } catch (e) {
    console.error('[revalidateBoardCategories]', e);
  }
}
