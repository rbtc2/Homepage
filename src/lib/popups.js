import { supabase } from './supabase';

const VALID_POSITIONS = new Set([
  'center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]);

function normalize(row) {
  if (!row) return null;
  return {
    id: row.id == null ? null : String(row.id),
    title: row.title ?? '',
    imageUrl: row.image_url ?? '',
    linkUrl: row.link_url ?? '',
    startDate: row.start_date,
    endDate: row.end_date,
    position: VALID_POSITIONS.has(row.position) ? row.position : 'center',
    widthPx: row.width_px == null ? null : Number(row.width_px),
    heightPx: row.height_px == null ? null : Number(row.height_px),
    offsetX: Number(row.offset_x) || 0,
    offsetY: Number(row.offset_y) || 0,
    showCloseForDay: Boolean(row.show_close_for_day),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at?.slice?.(0, 10) ?? row.created_at,
  };
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** 관리자: 전체 팝업 목록 */
export async function getPopups() {
  const { data, error } = await supabase
    .from('site_popups')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

/** 사이트: 현재 노출 대상 팝업 */
export async function getActiveSitePopups() {
  const today = todayIso();
  const { data, error } = await supabase
    .from('site_popups')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

/** 대시보드: 노출 중 팝업 수 */
export async function getActivePopupCount() {
  const items = await getActiveSitePopups();
  return items.length;
}

export { VALID_POSITIONS };
