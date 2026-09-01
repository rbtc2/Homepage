/** 본문 삽입 이미지와 동일한 너비 범위 */
export const COVER_WIDTH_MIN = 40;
export const COVER_WIDTH_MAX = 2400;

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
