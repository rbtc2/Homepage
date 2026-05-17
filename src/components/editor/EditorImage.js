import Image from '@tiptap/extension-image';
import { NodeSelection, Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';

const ALIGNMENTS = new Set(['left', 'center', 'right']);

const MIN_WIDTH = 40;
const MAX_WIDTH = 2400;

function clampMargin(value) {
  const n = Number.parseInt(String(value ?? 0), 10);
  if (Number.isNaN(n)) return 0;
  return Math.min(400, Math.max(0, n));
}

function parseWidthPx(value) {
  if (value == null || value === '') return null;
  const s = String(value).trim();
  const match = s.match(/^(\d+(?:\.\d+)?)\s*px?$/i) ?? s.match(/^(\d+)/);
  if (!match) return null;
  const n = Math.round(Number(match[1]));
  return Number.isNaN(n) || n <= 0 ? null : n;
}

function clampWidth(value) {
  const n = Number.parseInt(String(value ?? 0), 10);
  if (Number.isNaN(n) || n <= 0) return null;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, n));
}

function readImageWidth(img) {
  if (!img) return null;
  const fromData = parseWidthPx(img.getAttribute('data-width'));
  if (fromData) return clampWidth(fromData);
  const fromAttr = parseWidthPx(img.getAttribute('width'));
  if (fromAttr) return clampWidth(fromAttr);
  const fromStyle = parseWidthPx(img.style?.width);
  if (fromStyle) return clampWidth(fromStyle);
  return null;
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

/** 문서 위치의 본문 이미지 img 요소 */
export function getEditorImageElAtPos(editor, pos) {
  if (pos == null || !editor) return null;
  const node = editor.state.doc.nodeAt(pos);
  if (node?.type.name !== 'editorImage') return null;
  const dom = editor.view.nodeDOM(pos);
  if (!(dom instanceof HTMLElement)) return null;
  const img = dom.querySelector('img.ep-img-block__img') ?? dom.querySelector('img');
  return img instanceof HTMLImageElement ? img : null;
}

/** 에디터에서 선택된 본문 이미지의 img 요소 */
export function getSelectedEditorImageEl(editor) {
  const { selection } = editor?.state ?? {};
  if (selection?.node?.type.name === 'editorImage') {
    return getEditorImageElAtPos(editor, selection.from);
  }
  return null;
}

/** NodeSelection 없이 저장된 위치의 이미지 속성만 갱신합니다. */
export function updateEditorImageAt(editor, pos, attrs) {
  if (!editor || pos == null) return false;
  const { state } = editor;
  const node = state.doc.nodeAt(pos);
  if (!node || node.type.name !== 'editorImage') return false;
  editor.view.dispatch(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs }));
  return true;
}

/** 툴바 입력용 — 이미지 노드 선택을 해제하고 인접 텍스트 커서로 옮깁니다. */
export function releaseImageNodeSelection(editor, imagePos) {
  if (!editor || imagePos == null) return;
  const node = editor.state.doc.nodeAt(imagePos);
  if (!node || node.type.name !== 'editorImage') return;
  const after = imagePos + node.nodeSize;
  const { state, view } = editor;
  const $pos = state.doc.resolve(Math.min(after, state.doc.content.size));
  view.dispatch(state.tr.setSelection(TextSelection.near($pos)));
}

/** 저장된 너비 또는 현재 렌더 너비(px) */
export function getEditorImageDisplayWidth(editor, pos) {
  const resolvedPos =
    pos ??
    (editor?.state.selection.node?.type.name === 'editorImage'
      ? editor.state.selection.from
      : null);
  const node = resolvedPos != null ? editor?.state.doc.nodeAt(resolvedPos) : null;
  const attrs = node?.attrs ?? editor?.getAttributes('editorImage') ?? {};
  if (attrs.width) return clampWidth(attrs.width);
  const img =
    resolvedPos != null
      ? getEditorImageElAtPos(editor, resolvedPos)
      : getSelectedEditorImageEl(editor);
  if (!img) return null;
  const rendered = Math.round(img.getBoundingClientRect().width);
  if (rendered > 0) return rendered;
  if (img.naturalWidth > 0) return img.naturalWidth;
  return null;
}

/**
 * 본문용 블록 이미지 — 너비(px), 좌·우 여백, 정렬을 HTML에 보존합니다.
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
      width: {
        default: null,
        parseHTML: (el) => {
          const img = el.tagName === 'IMG' ? el : el.querySelector?.('img');
          return readImageWidth(img);
        },
        renderHTML: (attrs) => {
          const w = clampWidth(attrs.width);
          if (!w) return {};
          return { 'data-width': String(w) };
        },
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
            width: readImageWidth(img),
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
          width: readImageWidth(node),
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
    const width = clampWidth(node.attrs.width);

    const imgAttrs = {
      src: node.attrs.src,
      alt: node.attrs.alt || '',
      ...(node.attrs.title ? { title: node.attrs.title } : {}),
      class: 'ep-img-block__img',
      draggable: 'false',
    };

    if (width) {
      imgAttrs['data-width'] = String(width);
      imgAttrs.style = `width:${width}px;height:auto`;
    }

    return [
      'div',
      {
        class: `ep-img-block ep-img-block--${align}`,
        'data-align': align,
        'data-margin-left': String(marginLeft),
        'data-margin-right': String(marginRight),
        style: `--ep-img-ml:${marginLeft}px;--ep-img-mr:${marginRight}px`,
      },
      ['img', imgAttrs],
    ];
  },

  addProseMirrorPlugins() {
    const key = new PluginKey('editorImageKeyGuard');
    return [
      new Plugin({
        key,
        props: {
          handleKeyDown(view, event) {
            if (document.activeElement?.closest('.ep-img-bubble')) {
              return true;
            }
            const { selection } = view.state;
            if (
              selection instanceof NodeSelection &&
              selection.node.type.name === 'editorImage' &&
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey
            ) {
              return true;
            }
            return false;
          },
          handleTextInput(view) {
            if (document.activeElement?.closest('.ep-img-bubble')) {
              return true;
            }
            const { selection } = view.state;
            if (
              selection instanceof NodeSelection &&
              selection.node.type.name === 'editorImage'
            ) {
              return true;
            }
            return false;
          },
        },
      }),
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
      updateEditorImageAtPos:
        (pos, attrs) =>
        ({ editor }) =>
          updateEditorImageAt(editor, pos, attrs),
    };
  },
});

export { clampMargin, clampWidth, normalizeAlign, MIN_WIDTH, MAX_WIDTH };
