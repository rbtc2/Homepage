/** 본문 삽입 이미지와 동일한 너비 범위 */
export const COVER_WIDTH_MIN = 40;
export const COVER_WIDTH_MAX = 2400;

/** `cover_image` URL 뒤에 붙는 본문 너비 표시. 이미지 요청에는 포함되지 않습니다. */
const COVER_WIDTH_HASH_RE = /#cw=(\d+)\s*$/i;

/**
 * 커버/썸네일 본문 표시 너비(px). 비어 있으면 null(전체 너비).
 * @param {unknown} value
 * @returns {number|null}
 */
export function parseCoverWidthPx(value) {
  if (value == null || value === '') return null;
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(COVER_WIDTH_MAX, Math.max(COVER_WIDTH_MIN, n));
}

/**
 * 입력 필드용 문자열. 유효한 값이 없으면 빈 문자열.
 * @param {unknown} value
 * @returns {string}
 */
export function coverWidthToInput(value) {
  const n = parseCoverWidthPx(value);
  return n == null ? '' : String(n);
}

/**
 * DB `cover_image` 값에서 실제 URL과 본문 너비를 분리합니다.
 * @param {unknown} value
 * @returns {{ url: string|null, width: number|null }}
 */
export function parseStoredCoverImage(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return { url: null, width: null };
  const match = raw.match(COVER_WIDTH_HASH_RE);
  if (!match || match.index == null) return { url: raw, width: null };
  const url = raw.slice(0, match.index).trim();
  return { url: url || null, width: parseCoverWidthPx(match[1]) };
}

/**
 * 커버 URL과 본문 너비를 `cover_image` 컬럼에 저장할 문자열로 합칩니다.
 * 새 DB 컬럼 없이 기존 TEXT 필드만 사용합니다.
 * @param {unknown} url
 * @param {unknown} width
 * @returns {string|null}
 */
export function serializeStoredCoverImage(url, width) {
  const base = parseStoredCoverImage(url).url;
  if (!base) return null;
  const w = parseCoverWidthPx(width);
  return w == null ? base : `${base}#cw=${w}`;
}
