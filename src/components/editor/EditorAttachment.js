import { Node } from '@tiptap/core';

function normalizeFileName(value) {
  const name = String(value ?? '').trim();
  return name || '첨부파일';
}

/**
 * 본문 첨부파일 블록 — 다운로드 링크 HTML을 보존합니다.
 */
export const EditorAttachment = Node.create({
  name: 'editorAttachment',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: false,

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (el) => el.querySelector('a')?.getAttribute('href'),
      },
      fileName: {
        default: '첨부파일',
        parseHTML: (el) =>
          el.getAttribute('data-file-name') ??
          el.querySelector('.ep-attach-block__name')?.textContent ??
          '첨부파일',
        renderHTML: (attrs) => ({ 'data-file-name': normalizeFileName(attrs.fileName) }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.ep-attach-block',
        getAttrs: (dom) => {
          const link = dom.querySelector('a.ep-attach-block__link') ?? dom.querySelector('a[href]');
          return {
            href: link?.getAttribute('href'),
            fileName: normalizeFileName(
              dom.getAttribute('data-file-name') ??
                dom.querySelector('.ep-attach-block__name')?.textContent
            ),
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const fileName = normalizeFileName(node.attrs.fileName);
    const href = node.attrs.href;
    if (!href) {
      return ['div', { class: 'ep-attach-block', 'data-file-name': fileName }];
    }

    return [
      'div',
      { class: 'ep-attach-block', 'data-file-name': fileName },
      [
        'a',
        {
          class: 'ep-attach-block__link',
          href,
          download: fileName,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        ['span', { class: 'ep-attach-block__icon', 'aria-hidden': 'true' }],
        ['span', { class: 'ep-attach-block__name' }, fileName],
        ['span', { class: 'ep-attach-block__hint' }, '다운로드'],
      ],
    ];
  },

  addCommands() {
    return {
      setEditorAttachment:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              fileName: '첨부파일',
              ...attrs,
            },
          }),
    };
  },
});
