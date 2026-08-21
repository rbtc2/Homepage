/**
 * 한글·워드 등에서 붙여넣은 HTML에서 MSO 잔여물과 로컬 이미지를 걷어냅니다.
 * 브라우저 DOMParser가 있을 때만 동작합니다.
 */
const KEEP_TAGS = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE', 'DEL',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'UL', 'OL', 'LI',
  'A', 'IMG',
  'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'COLGROUP', 'COL',
  'BLOCKQUOTE', 'PRE', 'CODE', 'HR', 'SUB', 'SUP', 'MARK',
  'SPAN',
]);

const KEEP_ATTR = new Set([
  'href', 'src', 'alt', 'title', 'colspan', 'rowspan', 'target', 'rel', 'style',
]);

const KEEP_STYLE = new Set([
  'text-align',
  'color',
  'background-color',
  'font-size',
  'vertical-align',
]);

function cleanStyle(value) {
  if (!value) return '';
  return value
    .split(';')
    .map((part) => part.trim())
    .filter((decl) => {
      if (!decl) return false;
      const prop = decl.split(':')[0]?.trim().toLowerCase();
      if (!prop || !KEEP_STYLE.has(prop)) return false;
      if (prop.startsWith('mso-')) return false;
      return true;
    })
    .join('; ');
}

function unwrap(el) {
  const parent = el.parentNode;
  if (!parent) {
    el.remove();
    return;
  }
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function isRemoteSrc(src) {
  if (!src) return false;
  return /^(https?:\/\/|\/)/i.test(src);
}

/**
 * @param {string} html
 * @returns {string}
 */
export function cleanPastedHtml(html) {
  if (!html || typeof html !== 'string') return html;
  if (typeof DOMParser === 'undefined') return html;

  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<\/?o:\w+[^>]*>/gi, '')
    .replace(/<\/?v:\w+[^>]*>/gi, '')
    .replace(/<\/?w:\w+[^>]*>/gi, '')
    .replace(/<\/?m:\w+[^>]*>/gi, '');

  const doc = new DOMParser().parseFromString(stripped, 'text/html');

  const visit = (el) => {
    [...el.children].forEach((child) => visit(child));

    const tag = el.tagName;
    if (tag === 'IMG' && !isRemoteSrc(el.getAttribute('src'))) {
      el.remove();
      return;
    }

    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name === 'style') {
        const cleaned = cleanStyle(attr.value);
        if (cleaned) el.setAttribute('style', cleaned);
        else el.removeAttribute('style');
        return;
      }
      if (!KEEP_ATTR.has(name)) {
        el.removeAttribute(attr.name);
      }
    });

    if (tag === 'FONT') {
      const color = el.getAttribute('color');
      const span = doc.createElement('span');
      if (color) span.setAttribute('style', `color:${color}`);
      while (el.firstChild) span.appendChild(el.firstChild);
      el.replaceWith(span);
      return;
    }

    if (tag === 'SPAN') {
      if (!el.getAttribute('style') && !el.querySelector('img, table')) {
        unwrap(el);
      }
      return;
    }

    if (!KEEP_TAGS.has(tag)) {
      unwrap(el);
    }
  };

  visit(doc.body);
  return doc.body.innerHTML;
}
