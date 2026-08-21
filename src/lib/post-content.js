import { sanitizePostHtmlAsync } from './sanitize-html';

/** 저장·업데이트 직전 본문 HTML 정제. 실패 시 throw → 저장 거부. */
export async function preparePostContentForStorage(content) {
  return sanitizePostHtmlAsync(content ?? '');
}
