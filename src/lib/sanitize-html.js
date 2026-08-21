import sanitizeHtmlLib from 'sanitize-html';

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
  'data-indent',
  'data-youtube-id',
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

const FONT_SIZE_DECL = /^font-size:\s*(\d+(?:\.\d+)?)px$/i;

function isAllowedStyleDecl(decl) {
  const prop = decl.split(':')[0]?.trim().toLowerCase();
  if (!prop || !ALLOWED_STYLE_PROPS.has(prop)) return false;
  const lower = decl.toLowerCase();
  if (lower.includes('expression(') || lower.includes('javascript:')) return false;
  if (prop === 'font-size') {
    const match = decl.match(FONT_SIZE_DECL);
    if (!match) return false;
    const size = Number(match[1]);
    return size >= 10 && size <= 72;
  }
  return true;
}

function filterInlineStyle(value) {
  if (!value) return '';
  return String(value)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(isAllowedStyleDecl)
    .join('; ');
}

function resolveSanitizeHtml() {
  if (typeof sanitizeHtmlLib === 'function') return sanitizeHtmlLib;
  if (typeof sanitizeHtmlLib?.default === 'function') return sanitizeHtmlLib.default;
  throw new Error('sanitize-html export is not a function');
}

const SANITIZE_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: { '*': ALLOWED_ATTR },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
    a: ['http', 'https', 'mailto', 'tel'],
    iframe: ['https'],
  },
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
    'youtube-nocookie.com',
  ],
  allowProtocolRelative: false,
  exclusiveFilter: (frame) => frame.tag === 'iframe' && !frame.attribs?.src,
  transformTags: {
    '*': (tagName, attribs) => {
      const next = { ...attribs };
      if (next.style) {
        const style = filterInlineStyle(next.style);
        if (style) next.style = style;
        else delete next.style;
      }
      return { tagName, attribs: next };
    },
  },
};

/**
 * 게시물 본문 HTML을 XSS 없이 안전하게 정제합니다.
 * htmlparser2 기반이라 Server Action에서 jsdom/window가 필요 없습니다.
 */
export function sanitizePostHtml(html) {
  if (html == null) return '';
  const raw = String(html);
  if (!raw.trim()) return '';
  return resolveSanitizeHtml()(raw, SANITIZE_OPTIONS).trim();
}
