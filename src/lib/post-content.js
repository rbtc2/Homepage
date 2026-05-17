import { sanitizePostHtml } from './sanitize-html';

/** 저장·업데이트 직전 본문 HTML 정제 (공개 렌더와 동일 규칙) */
export function preparePostContentForStorage(content) {
  return sanitizePostHtml(content ?? '').trim();
}
