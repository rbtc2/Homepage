'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  VALID_POSITIONS,
  isMissingScheduleColumnError,
  supportsPopupScheduleSchema,
} from '@/lib/popups';
import { kstDatetimeLocalToIso } from '@/lib/popup-schedule';
import { revalidatePath } from 'next/cache';

const MIGRATION_HINT =
  'Supabase에 supabase/migrations/20260521120000_site_popups_schedule.sql 마이그레이션을 적용해 주세요.';

function todayKstDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
}

function sharedFields(data) {
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

  return {
    title,
    imageUrl,
    linkUrl,
    displayMode,
    position,
    widthPx: Number.isFinite(widthPx) ? widthPx : null,
    heightPx: Number.isFinite(heightPx) ? heightPx : null,
    offsetX,
    offsetY,
    showCloseForDay: Boolean(data.showCloseForDay),
    isActive: Boolean(data.isActive),
  };
}

function buildSchedulePayload(data) {
  const fields = sharedFields(data);
  const payload = {
    title: fields.title,
    image_url: fields.imageUrl,
    link_url: fields.linkUrl,
    display_mode: fields.displayMode,
    position: fields.position,
    width_px: fields.widthPx,
    height_px: fields.heightPx,
    offset_x: fields.offsetX,
    offset_y: fields.offsetY,
    show_close_for_day: fields.showCloseForDay,
    is_active: fields.isActive,
    start_at: null,
    end_at: null,
  };

  if (fields.displayMode === 'scheduled') {
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

/** 마이그레이션 전 DB: start_date / end_date + is_active */
function buildLegacyPayload(data) {
  const fields = sharedFields(data);
  const today = todayKstDate();

  if (fields.displayMode === 'immediate') {
    return {
      title: fields.title,
      image_url: fields.imageUrl,
      link_url: fields.linkUrl,
      position: fields.position,
      width_px: fields.widthPx,
      height_px: fields.heightPx,
      offset_x: fields.offsetX,
      offset_y: fields.offsetY,
      show_close_for_day: fields.showCloseForDay,
      is_active: fields.isActive,
      start_date: today,
      end_date: '2099-12-31',
    };
  }

  const startDate = (data.startAt ?? '').slice(0, 10);
  const endDate = (data.endAt ?? '').slice(0, 10);
  if (!startDate || !endDate) {
    throw new Error('예약 노출의 시작·종료 날짜를 입력해 주세요.');
  }
  if (startDate > endDate) {
    throw new Error('종료일은 시작일 이후여야 합니다.');
  }

  return {
    title: fields.title,
    image_url: fields.imageUrl,
    link_url: fields.linkUrl,
    position: fields.position,
    width_px: fields.widthPx,
    height_px: fields.heightPx,
    offset_x: fields.offsetX,
    offset_y: fields.offsetY,
    show_close_for_day: fields.showCloseForDay,
    is_active: true,
    start_date: startDate,
    end_date: endDate,
  };
}

async function buildPayload(data) {
  const admin = getSupabaseAdmin();
  const useSchedule = await supportsPopupScheduleSchema(admin);
  return useSchedule ? buildSchedulePayload(data) : buildLegacyPayload(data);
}

function revalidatePopupPaths() {
  revalidatePath('/');
  revalidatePath('/admin/popups');
  revalidatePath('/admin');
}

function wrapDbError(error) {
  if (isMissingScheduleColumnError(error)) {
    throw new Error(`${error.message}\n\n${MIGRATION_HINT}`);
  }
  throw new Error(error.message);
}

export async function createPopup(data) {
  const payload = await buildPayload(data);
  const { data: row, error } = await getSupabaseAdmin()
    .from('site_popups')
    .insert(payload)
    .select()
    .single();

  if (error) wrapDbError(error);
  revalidatePopupPaths();
  return row;
}

export async function updatePopup(id, data) {
  const payload = await buildPayload(data);
  const { data: row, error } = await getSupabaseAdmin()
    .from('site_popups')
    .update(payload)
    .eq('id', Number(id))
    .select()
    .single();

  if (error) wrapDbError(error);
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
