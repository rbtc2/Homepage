import { isEmptyPostHtml } from '@/lib/is-empty-post-html';

/**
 * 게시물 본문 HTML — 저장 시 preparePostContentForStorage로 이미 살균됨.
 */
export default function SafeHtml({ html, className }) {
  if (isEmptyPostHtml(html)) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: String(html) }}
    />
  );
}
