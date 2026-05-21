import { supabase } from './supabase';
import {
  isPopupVisibleNow,
  kstDateToDayEndIso,
  kstDateToDayStartIso,
} from './popup-schedule';

const VALID_POSITIONS = new Set([
  'center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]);

function isMissingScheduleColumnError(error) {
  const msg = (error?.message ?? '').toLowerCase();
  return (
    msg.includes('display_mode') ||
    msg.includes('start_at') ||
    msg.includes('end_at') ||
    error?.code === '42703' ||
    error?.code === 'PGRST204'
  );
}

function normalize(row) {
  if (!row) return null;

  let displayMode = 'scheduled';
  if (row.display_mode === 'immediate') displayMode = 'immediate';
  else if (row.display_mode === 'scheduled') displayMode = 'scheduled';

  let startAt = row.start_at ?? null;
  let endAt = row.end_at ?? null;

  if (!startAt && row.start_date) startAt = kstDateToDayStartIso(row.start_date);
  if (!endAt && row.end_date) endAt = kstDateToDayEndIso(row.end_date);

  return {
    id: row.id == null ? null : String(row.id),
    title: row.title ?? '',
    imageUrl: row.image_url ?? '',
    linkUrl: row.link_url ?? '',
    displayMode,
    startAt,
    endAt,
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

let scheduleSchemaSupported = null;

/** 신규 스케줄 컬럼(display_mode, start_at, end_at) 존재 여부 */
export async function supportsPopupScheduleSchema(client = supabase) {
  if (scheduleSchemaSupported !== null) return scheduleSchemaSupported;
  const { error } = await client.from('site_popups').select('display_mode').limit(1);
  if (!error) {
    scheduleSchemaSupported = true;
    return true;
  }
  if (isMissingScheduleColumnError(error)) {
    scheduleSchemaSupported = false;
    return false;
  }
  throw new Error(error.message);
}

/** 관리자: 전체 팝업 목록 */
export async function getPopups() {
  const { data, error } = await supabase
    .from('site_popups')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize).filter(Boolean);
}

/** 사이트: 현재 노출 대상 팝업 (DB 컬럼 유무와 무관하게 JS에서 판별) */
export async function getActiveSitePopups() {
  const { data, error } = await supabase.from('site_popups').select('*');

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map(normalize)
    .filter((popup) => popup && isPopupVisibleNow(popup))
    .sort((a, b) => Number(b.id) - Number(a.id));
}

/** 대시보드: 노출 중 팝업 수 */
export async function getActivePopupCount() {
  const items = await getActiveSitePopups();
  return items.length;
}

export { VALID_POSITIONS, isMissingScheduleColumnError };
