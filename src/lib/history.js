import { supabase } from './supabase';

const BASE_COLUMNS = 'id, year, month, title, detail, created_at';
const EN_COLUMNS = `${BASE_COLUMNS}, title_en, detail_en`;

function hasEnglishTitle(titleEn) {
  return Boolean(String(titleEn ?? '').trim());
}

/**
 * @typedef {Object} HistoryEvent
 * @property {string} id
 * @property {number} year
 * @property {number} month
 * @property {string} title
 * @property {string} detail
 * @property {string} titleEn
 * @property {string} detailEn
 * @property {boolean} hasEnglish
 * @property {string|null} createdAt
 */

function normalize(row) {
  if (!row) return null;
  const year = Number(row.year);
  const month = Number(row.month);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  const titleEn = row.title_en ?? '';
  const detailEn = row.detail_en ?? '';
  return {
    id: row.id == null ? null : String(row.id),
    year,
    month,
    title: row.title ?? '',
    detail: row.detail ?? '',
    titleEn,
    detailEn,
    hasEnglish: hasEnglishTitle(titleEn),
    createdAt: row.created_at?.slice?.(0, 10) ?? row.created_at ?? null,
  };
}

function compareEventsDesc(a, b) {
  if (a.year !== b.year) return b.year - a.year;
  if (a.month !== b.month) return b.month - a.month;
  return Number(b.id) - Number(a.id);
}

function isMissingEnColumnError(error) {
  const msg = String(error?.message ?? '');
  return /title_en|detail_en|column/i.test(msg);
}

async function fetchHistoryRows(selectList, { id } = {}) {
  let q = supabase
    .from('history_events')
    .select(selectList)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .order('id', { ascending: false });

  if (id != null && id !== '') {
    q = supabase
      .from('history_events')
      .select(selectList)
      .eq('id', id)
      .maybeSingle();
  }

  return q;
}

export function localizeHistoryEvent(event, locale = 'ko') {
  if (!event) return null;
  if (locale !== 'en' || !event.hasEnglish) return event;
  return {
    ...event,
    title: event.titleEn,
    detail: event.detailEn,
  };
}

export function localizeHistoryEvents(events, locale = 'ko') {
  return (events ?? []).map((event) => localizeHistoryEvent(event, locale));
}

export const FALLBACK_HISTORY_EVENTS = [
  {
    id: 'fallback-7',
    year: 2026,
    month: 7,
    title: '이주여성 문화 콘텐츠 강사 양성과정 1기 입과',
    detail: '',
    titleEn: '',
    detailEn: '',
    hasEnglish: false,
    createdAt: null,
  },
  {
    id: 'fallback-3',
    year: 2026,
    month: 3,
    title: '창립총회 개회',
    detail: '',
    titleEn: '',
    detailEn: '',
    hasEnglish: false,
    createdAt: null,
  },
];

/** 관리자·공개: 최신 연·월 순 전체 목록 */
export async function getHistoryEvents() {
  let { data, error } = await fetchHistoryRows(EN_COLUMNS);
  if (error && isMissingEnColumnError(error)) {
    ({ data, error } = await fetchHistoryRows(BASE_COLUMNS));
  }
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize).filter(Boolean);
}

export async function getHistoryEventById(id) {
  if (id == null || id === '') return null;
  const idEq = String(id).trim();
  let { data, error } = await fetchHistoryRows(EN_COLUMNS, { id: idEq });
  if (error && isMissingEnColumnError(error)) {
    ({ data, error } = await fetchHistoryRows(BASE_COLUMNS, { id: idEq }));
  }
  if (error) return null;
  return normalize(data);
}

/**
 * 공개 연혁 페이지용: 연도별 묶음 (최신 연도가 앞, 같은 해는 최신 월이 위)
 * @param {HistoryEvent[]} events
 * @returns {Array<{ year: string, events: HistoryEvent[] }>}
 */
export function groupHistoryByYear(events) {
  const byYear = new Map();
  const sorted = [...events].sort(compareEventsDesc);

  for (const ev of sorted) {
    const key = String(ev.year);
    const list = byYear.get(key);
    if (list) list.push(ev);
    else byYear.set(key, [ev]);
  }

  return [...byYear.entries()].map(([year, yearEvents]) => ({
    year,
    events: yearEvents,
  }));
}
