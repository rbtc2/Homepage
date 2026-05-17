/**
 * 게시물 id 내림차순 비교 (db.js normalize 후 id는 문자열).
 * 숫자 비교가 가능하면 숫자로, 아니면 localeCompare(numeric).
 */
export function comparePostIdsDesc(a, b) {
  const na = Number(a?.id);
  const nb = Number(b?.id);
  if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) {
    return nb - na;
  }
  return String(b?.id ?? '').localeCompare(String(a?.id ?? ''), undefined, {
    numeric: true,
  });
}
