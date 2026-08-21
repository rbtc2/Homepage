import { isEmptyPostHtml } from './is-empty-post-html';

export { isEmptyPostHtml };

/** TipTap(에디터) 출력 + 저장 시 허용할 태그 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img', 'div', 'span',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
  'blockquote', 'pre', 'code', 'hr', 'sub', 'sup',
  'mark', 'iframe',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'title', 'alt', 'src', 'width', 'height',
  'class', 'colspan', 'rowspan', 'colwidth', 'align', 'download',
  'data-align', 'data-width', 'data-margin-left', 'data-margin-right',
  'data-caption',
  'data-file-name',
  'data-cell-bgcolor',
  'data-color',
  'data-text-align', 'data-vertical-align', 'data-row-height',
  'data-border-top', 'data-border-right', 'data-border-bottom', 'data-border-left',
  'data-indent', 'data-youtube-id',
  'allow', 'allowfullscreen', 'referrerpolicy', 'loading', 'frameborder',
  'style',
  'aria-hidden',
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
  'min-width',
  'margin-left',
  'margin-right',
  'vertical-align',
  'font-size',
  '--ep-img-ml',
  '--ep-img-mr',
]);

const YOUTUBE_EMBED_SRC =
  /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}$/;

const FONT_SIZE_DECL = /^font-size:\s*(\d+(?:\.\d+)?)px$/i;

const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|\/(?!\/)|#|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_ATTR: ['target', 'allowfullscreen'],
};

let domPurifyPromise = null;
let styleHookRegistered = false;

function isAllowedStyleDecl(decl) {
  const prop = decl.split(':')[0]?.trim().toLowerCase();
  if (!prop || !ALLOWED_STYLE_PROPS.has(prop)) return false;
  if (prop === 'font-size') {
    const match = decl.match(FONT_SIZE_DECL);
    if (!match) return false;
    const size = Number(match[1]);
    return size >= 10 && size <= 72;
  }
  return true;
}

function registerStyleHook(DOMPurify) {
  if (styleHookRegistered) return;
  styleHookRegistered = true;

  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName !== 'style' || !data.attrValue) return;

    const filtered = data.attrValue
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter(isAllowedStyleDecl)
      .join('; ');

    data.attrValue = filtered;
  });

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (String(data.tagName || '').toLowerCase() !== 'iframe') return;
    const src = node.getAttribute?.('src') || '';
    if (!YOUTUBE_EMBED_SRC.test(src)) {
      node.parentNode?.removeChild(node);
    }
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
