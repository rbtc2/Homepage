import { sanitizePostHtml } from './sanitize-html';

/** 저장·업데이트 직전 본문 HTML 정제. */
export async function preparePostContentForStorage(content) {
  return sanitizePostHtml(content ?? '');
}
