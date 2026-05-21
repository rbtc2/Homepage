/** PostgREST .eq('id', …) — bigint 문자열·UUID에서 Number() 정밀도 손실 방지 */
export function rowIdForEq(id) {
  if (id == null || id === '') throw new Error('잘못된 게시물 식별자입니다.');
  if (typeof id === 'number') {
    if (!Number.isInteger(id) || id < 1) throw new Error('잘못된 게시물 식별자입니다.');
    return id;
  }
  const s = String(id).trim();
  if (!s) throw new Error('잘못된 게시물 식별자입니다.');
  return s;
}
