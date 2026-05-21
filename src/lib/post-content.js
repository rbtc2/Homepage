import { sanitizePostHtmlAsync } from './sanitize-html';

/** 저장·업데이트 직전 본문 HTML 정제 (Server Action 전용, async) */
export async function preparePostContentForStorage(content) {
  return sanitizePostHtmlAsync(content ?? '');
}
