import { isEmptyPostHtml } from './is-empty-post-html';

export { isEmptyPostHtml };

/** TipTap(에디터) 출력 + 저장 시 허용할 태그 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img', 'div', 'span',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code', 'hr', 'sub', 'sup',
  'mark',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'title', 'alt', 'src', 'width', 'height',
  'class', 'colspan', 'rowspan', 'align',
  'data-align', 'data-width', 'data-margin-left', 'data-margin-right',
  'data-cell-bgcolor',
  'data-color',
  'data-border-top', 'data-border-right', 'data-border-bottom', 'data-border-left',
  'style',
];

const ALLOWED_STYLE_PROPS = new Set([
  'text-align',
  'color',
  'background-color',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'width',
  'height',
  'max-width',
  '--ep-img-ml',
  '--ep-img-mr',
]);

const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|\/(?!\/)|#|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_ATTR: ['target'],
};

let domPurifyPromise = null;
let styleHookRegistered = false;

function registerStyleHook(DOMPurify) {
  if (styleHookRegistered) return;
  styleHookRegistered = true;

  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName !== 'style' || !data.attrValue) return;

    const filtered = data.attrValue
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((decl) => {
        const prop = decl.split(':')[0]?.trim().toLowerCase();
        return prop && ALLOWED_STYLE_PROPS.has(prop);
      })
      .join('; ');

    data.attrValue = filtered;
  });
}

async function getDOMPurify() {
  if (!domPurifyPromise) {
    domPurifyPromise = import('isomorphic-dompurify').then((mod) => {
      const DOMPurify = mod.default ?? mod;
      registerStyleHook(DOMPurify);
      return DOMPurify;
    });
  }
  return domPurifyPromise;
}

/**
 * 게시물 본문 HTML을 XSS 없이 안전하게 정제합니다.
 * DOMPurify는 최초 호출 시에만 로드합니다 (Server Action·서버리스 호환).
 */
export async function sanitizePostHtmlAsync(html) {
  if (html == null) return '';
  const raw = String(html);
  if (!raw.trim()) return '';

  try {
    const DOMPurify = await getDOMPurify();
    return DOMPurify.sanitize(raw, SANITIZE_CONFIG).trim();
  } catch (e) {
    console.error('[sanitizePostHtmlAsync]', e);
    return raw.trim();
  }
}

/** @deprecated 클라이언트·동기 경로용 — 가능하면 sanitizePostHtmlAsync 사용 */
export function sanitizePostHtml(html) {
  if (html == null) return '';
  const raw = String(html);
  if (!raw.trim()) return '';
  return raw.trim();
}
