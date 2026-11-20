import { supabase } from './supabase';
import { VALID_POSITIONS } from './popup-placement';

function normalize(row) {
  if (!row) return null;
  return {
    id: row.id == null ? null : String(row.id),
    title: row.title ?? '',
    imageUrl: row.image_url ?? '',
    linkUrl: row.link_url ?? '',
    displayMode: row.display_mode === 'immediate' ? 'immediate' : 'scheduled',
    startAt: row.start_at ?? null,
    endAt: row.end_at ?? null,
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

/** 관리자: 전체 팝업 목록 */
export async function getPopups() {
  const { data, error } = await supabase
    .from('site_popups')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize).filter(Boolean);
}

/** 사이트: 현재 노출 대상 팝업. 조회 실패 시 빈 배열(공개 페이지를 막지 않음). */
export async function getActiveSitePopups() {
  try {
    const now = new Date().toISOString();

    const [immediateRes, scheduledRes] = await Promise.all([
      supabase
        .from('site_popups')
        .select('*')
        .eq('display_mode', 'immediate')
        .eq('is_active', true),
      supabase
        .from('site_popups')
        .select('*')
        .eq('display_mode', 'scheduled')
        .eq('is_active', true)
        .lte('start_at', now)
        .gte('end_at', now),
    ]);

    if (immediateRes.error) {
      console.error('[getActiveSitePopups]', immediateRes.error.message);
      return [];
    }
    if (scheduledRes.error) {
      console.error('[getActiveSitePopups]', scheduledRes.error.message);
      return [];
    }

    const merged = [...(immediateRes.data ?? []), ...(scheduledRes.data ?? [])];
    const byId = new Map();

    for (const row of merged) {
      const item = normalize(row);
      if (item) byId.set(item.id, item);
    }

    return [...byId.values()].sort((a, b) => Number(b.id) - Number(a.id));
  } catch (err) {
    console.error('[getActiveSitePopups]', err);
    return [];
  }
}

/** 대시보드: 노출 중 팝업 수 */
export async function getActivePopupCount() {
  const items = await getActiveSitePopups();
  return items.length;
}

export { VALID_POSITIONS };
