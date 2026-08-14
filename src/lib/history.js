import { supabase } from './supabase';

/**
 * @typedef {Object} HistoryEvent
 * @property {string} id
 * @property {number} year
 * @property {number} month
 * @property {string} title
 * @property {string} detail
 * @property {string|null} createdAt
 */

function normalize(row) {
  if (!row) return null;
  const year = Number(row.year);
  const month = Number(row.month);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  return {
    id: row.id == null ? null : String(row.id),
    year,
    month,
    title: row.title ?? '',
    detail: row.detail ?? '',
    createdAt: row.created_at?.slice?.(0, 10) ?? row.created_at ?? null,
  };
}

function compareEventsDesc(a, b) {
  if (a.year !== b.year) return b.year - a.year;
  if (a.month !== b.month) return b.month - a.month;
  return Number(b.id) - Number(a.id);
}

/** 관리자·공개: 최신 연·월 순 전체 목록 */
export async function getHistoryEvents() {
  const { data, error } = await supabase
    .from('history_events')
    .select('id, year, month, title, detail, created_at')
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize).filter(Boolean);
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
