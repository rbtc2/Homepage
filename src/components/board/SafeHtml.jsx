import { isEmptyPostHtml } from '@/lib/is-empty-post-html';

/**
 * 게시물 본문 HTML — 저장 시 preparePostContentForStorage로 이미 살균됨.
 * 살균 실패 시 저장이 거부되므로, RSC에서 jsdom을 로드해 재살균하지 않습니다.
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
