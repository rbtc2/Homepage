import Image from '@tiptap/extension-image';

const ALIGNMENTS = new Set(['left', 'center', 'right']);

function clampMargin(value) {
  const n = Number.parseInt(String(value ?? 0), 10);
  if (Number.isNaN(n)) return 0;
  return Math.min(400, Math.max(0, n));
}

function normalizeAlign(value) {
  return ALIGNMENTS.has(value) ? value : 'center';
}

function readWrapAttrs(wrap) {
  if (!wrap) return {};
  return {
    align: normalizeAlign(wrap.getAttribute('data-align')),
    marginLeft: clampMargin(wrap.getAttribute('data-margin-left')),
    marginRight: clampMargin(wrap.getAttribute('data-margin-right')),
  };
}

/**
 * 본문용 블록 이미지 — 좌·우 여백(px)과 정렬(왼쪽/가운데/오른쪽)을 HTML에 보존합니다.
 */
export const EditorImage = Image.extend({
  name: 'editorImage',

  group: 'block',

  inline: false,

  draggable: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.getAttribute('src'),
        renderHTML: (attrs) => (attrs.src ? { src: attrs.src } : {}),
      },
      alt: {
        default: '',
        parseHTML: (el) => el.getAttribute('alt') ?? '',
        renderHTML: (attrs) => ({ alt: attrs.alt || '' }),
      },
      title: {
        default: null,
        parseHTML: (el) => el.getAttribute('title'),
        renderHTML: (attrs) => (attrs.title ? { title: attrs.title } : {}),
      },
      align: {
        default: 'center',
        parseHTML: (el) => {
          const wrap = el.closest?.('.ep-img-block');
          return normalizeAlign(wrap?.getAttribute('data-align') ?? el.getAttribute('data-align'));
        },
        renderHTML: (attrs) => ({ 'data-align': normalizeAlign(attrs.align) }),
      },
      marginLeft: {
        default: 0,
        parseHTML: (el) => {
          const wrap = el.closest?.('.ep-img-block');
          return clampMargin(wrap?.getAttribute('data-margin-left') ?? el.getAttribute('data-margin-left'));
        },
        renderHTML: (attrs) => ({ 'data-margin-left': String(clampMargin(attrs.marginLeft)) }),
      },
      marginRight: {
        default: 0,
        parseHTML: (el) => {
          const wrap = el.closest?.('.ep-img-block');
          return clampMargin(wrap?.getAttribute('data-margin-right') ?? el.getAttribute('data-margin-right'));
        },
        renderHTML: (attrs) => ({ 'data-margin-right': String(clampMargin(attrs.marginRight)) }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.ep-img-block img',
        priority: 60,
        getAttrs: (node) => {
          const img = node;
          const wrap = img.closest?.('.ep-img-block');
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') ?? '',
            title: img.getAttribute('title'),
            ...readWrapAttrs(wrap),
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => ({
          src: node.getAttribute('src'),
          alt: node.getAttribute('alt') ?? '',
          title: node.getAttribute('title'),
          align: 'center',
          marginLeft: 0,
          marginRight: 0,
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const align = normalizeAlign(node.attrs.align);
    const marginLeft = clampMargin(node.attrs.marginLeft);
    const marginRight = clampMargin(node.attrs.marginRight);

    return [
      'div',
      {
        class: `ep-img-block ep-img-block--${align}`,
        'data-align': align,
        'data-margin-left': String(marginLeft),
        'data-margin-right': String(marginRight),
        style: `--ep-img-ml:${marginLeft}px;--ep-img-mr:${marginRight}px`,
      },
      [
        'img',
        {
          src: node.attrs.src,
          alt: node.attrs.alt || '',
          ...(node.attrs.title ? { title: node.attrs.title } : {}),
          class: 'ep-img-block__img',
          draggable: 'false',
        },
      ],
    ];
  },

  addCommands() {
    return {
      setEditorImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              align: 'center',
              marginLeft: 0,
              marginRight: 0,
              alt: '',
              ...attrs,
            },
          }),
      updateEditorImage:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },
});

export { clampMargin, normalizeAlign };
