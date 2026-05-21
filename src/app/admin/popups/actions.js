'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { VALID_POSITIONS } from '@/lib/popups';
import { kstDatetimeLocalToIso } from '@/lib/popup-schedule';
import { revalidatePath } from 'next/cache';

function normalizePayload(data) {
  const title = (data.title ?? '').trim();
  const imageUrl = (data.imageUrl ?? '').trim();
  const linkUrl = (data.linkUrl ?? '').trim();
  const displayMode = data.displayMode === 'immediate' ? 'immediate' : 'scheduled';
  const position = VALID_POSITIONS.has(data.position) ? data.position : 'center';

  const widthRaw = data.widthPx;
  const heightRaw = data.heightPx;
  const widthPx =
    widthRaw === '' || widthRaw == null || widthRaw === undefined
      ? null
      : Math.max(120, Math.min(1200, Number(widthRaw)));
  const heightPx =
    heightRaw === '' || heightRaw == null || heightRaw === undefined
      ? null
      : Math.max(80, Math.min(900, Number(heightRaw)));

  const offsetX = Math.max(-400, Math.min(400, Number(data.offsetX) || 0));
  const offsetY = Math.max(-400, Math.min(400, Number(data.offsetY) || 0));

  if (!title) throw new Error('팝업 제목을 입력해 주세요.');
  if (!imageUrl) throw new Error('팝업 이미지를 등록해 주세요.');

  const payload = {
    title,
    image_url: imageUrl,
    link_url: linkUrl,
    display_mode: displayMode,
    position,
    width_px: Number.isFinite(widthPx) ? widthPx : null,
    height_px: Number.isFinite(heightPx) ? heightPx : null,
    offset_x: offsetX,
    offset_y: offsetY,
    show_close_for_day: Boolean(data.showCloseForDay),
    is_active: Boolean(data.isActive),
    start_at: null,
    end_at: null,
  };

  if (displayMode === 'scheduled') {
    const startAt = kstDatetimeLocalToIso(data.startAt);
    const endAt = kstDatetimeLocalToIso(data.endAt);
    if (!startAt || !endAt) {
      throw new Error('예약 노출의 시작·종료 시각을 모두 입력해 주세요.');
    }
    if (new Date(startAt).getTime() >= new Date(endAt).getTime()) {
      throw new Error('종료 시각은 시작 시각보다 이후여야 합니다.');
    }
    payload.start_at = startAt;
    payload.end_at = endAt;
  }

  return payload;
}

function revalidatePopupPaths() {
  revalidatePath('/');
  revalidatePath('/admin/popups');
  revalidatePath('/admin');
}

export async function createPopup(data) {
  const payload = normalizePayload(data);
  const { data: row, error } = await getSupabaseAdmin()
    .from('site_popups')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePopupPaths();
  return row;
}

export async function updatePopup(id, data) {
  const payload = normalizePayload(data);
  const { data: row, error } = await getSupabaseAdmin()
    .from('site_popups')
    .update(payload)
    .eq('id', Number(id))
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePopupPaths();
  return row;
}

export async function deletePopup(id) {
  const { error } = await getSupabaseAdmin()
    .from('site_popups')
    .delete()
    .eq('id', Number(id));

  if (error) throw new Error(error.message);
  revalidatePopupPaths();
}

export async function togglePopupActive(id) {
  const { data: current, error: fetchError } = await getSupabaseAdmin()
    .from('site_popups')
    .select('is_active')
    .eq('id', Number(id))
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error } = await getSupabaseAdmin()
    .from('site_popups')
    .update({ is_active: !current.is_active })
    .eq('id', Number(id));

  if (error) throw new Error(error.message);
  revalidatePopupPaths();
}
