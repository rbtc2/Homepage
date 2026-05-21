/** TipTap 빈 문서 등 표시하지 않을 본문 여부 (DOMPurify 없음 — RSC에서 안전) */
export function isEmptyPostHtml(html) {
  if (html == null || !String(html).trim()) return true;
  const t = String(html).replace(/\s/g, '');
  return t === '<p></p>' || t === '<p><br></p>' || t === '<p><br/></p>';
}
