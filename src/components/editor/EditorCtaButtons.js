import { Node } from '@tiptap/core';

const MAX_BUTTONS = 3;
const DEFAULT_LABEL = '바로가기';

function normalizeLabel(value) {
  const label = String(value ?? '').trim();
  return label || DEFAULT_LABEL;
}

function normalizeHref(value) {
  const href = String(value ?? '').trim();
  if (!href) return '';
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(href)) return href;
  return `https://${href}`;
}

/**
 * @param {unknown} raw
 * @returns {{ label: string, href: string }[]}
 */
export function normalizeCtaButtons(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MAX_BUTTONS)
    .map((item) => ({
      label: normalizeLabel(item?.label),
      href: normalizeHref(item?.href),
    }))
    .filter((item) => item.href);
}

function parseButtonsFromDom(dom) {
  const links = [...dom.querySelectorAll('a.ep-cta-block__btn, a[href]')];
  return normalizeCtaButtons(
    links.map((a) => ({
      label:
        a.getAttribute('data-label') ??
        a.textContent ??
        DEFAULT_LABEL,
      href: a.getAttribute('href'),
    }))
  );
}

/**
 * 본문 CTA 버튼 그룹 — 1~3개 링크 버튼을 HTML로 보존합니다.
 */
export const EditorCtaButtons = Node.create({
  name: 'editorCtaButtons',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: false,

  addAttributes() {
    return {
      buttons: {
        default: [],
        parseHTML: (el) => parseButtonsFromDom(el),
        renderHTML: () => ({}),
      },
      align: {
        default: 'center',
        parseHTML: (el) => {
          const align = el.getAttribute('data-align');
          if (align === 'left' || align === 'right' || align === 'center') return align;
          return 'center';
        },
        renderHTML: (attrs) => ({
          'data-align': attrs.align === 'left' || attrs.align === 'right' ? attrs.align : 'center',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.ep-cta-block',
        getAttrs: (dom) => ({
          buttons: parseButtonsFromDom(dom),
          align: dom.getAttribute('data-align') || 'center',
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const buttons = normalizeCtaButtons(node.attrs.buttons);
    const align =
      node.attrs.align === 'left' || node.attrs.align === 'right'
        ? node.attrs.align
        : 'center';

    if (buttons.length === 0) {
      return ['div', { class: 'ep-cta-block', 'data-align': align }];
    }

    return [
      'div',
      { class: 'ep-cta-block', 'data-align': align },
      ...buttons.map((btn) => [
        'a',
        {
          class: 'ep-cta-block__btn',
          href: btn.href,
          'data-label': btn.label,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        btn.label,
      ]),
    ];
  },

  addCommands() {
    return {
      setEditorCtaButtons:
        (attrs) =>
        ({ commands }) => {
          const buttons = normalizeCtaButtons(attrs?.buttons);
          if (buttons.length === 0) return false;
          return commands.insertContent({
            type: this.name,
            attrs: {
              buttons,
              align:
                attrs?.align === 'left' || attrs?.align === 'right'
                  ? attrs.align
                  : 'center',
            },
          });
        },
      updateEditorCtaButtons:
        (attrs) =>
        ({ commands, state }) => {
          const { selection } = state;
          const node = selection?.node;
          if (!node || node.type.name !== this.name) return false;
          const buttons = normalizeCtaButtons(attrs?.buttons ?? node.attrs.buttons);
          if (buttons.length === 0) return false;
          return commands.updateAttributes(this.name, {
            buttons,
            align:
              attrs?.align === 'left' || attrs?.align === 'right' || attrs?.align === 'center'
                ? attrs.align
                : node.attrs.align,
          });
        },
    };
  },
});

export { MAX_BUTTONS as CTA_BUTTONS_MAX };
