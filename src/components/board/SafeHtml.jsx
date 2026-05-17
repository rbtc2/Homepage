import { isEmptyPostHtml, sanitizePostHtml } from '@/lib/sanitize-html';

/**
 * 게시물 본문 HTML — sanitize 후 렌더 (서버 컴포넌트 전용).
 */
export default function SafeHtml({ html, className }) {
  if (isEmptyPostHtml(html)) return null;

  const safe = sanitizePostHtml(html);
  if (isEmptyPostHtml(safe)) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
