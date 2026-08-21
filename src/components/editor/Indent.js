import { Extension } from '@tiptap/core';

export const MAX_INDENT = 8;
export const INDENT_TYPES = ['paragraph', 'heading', 'blockquote'];

function readIndent(el) {
  const data = el.getAttribute('data-indent');
  if (data) {
    const n = Number.parseInt(data, 10);
    if (!Number.isNaN(n) && n > 0) return Math.min(MAX_INDENT, n);
  }
  return 0;
}

function applyIndentDelta(state, tr, delta) {
  const { from, to } = state.selection;
  let modified = false;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!INDENT_TYPES.includes(node.type.name)) return true;
    const current = Number(node.attrs.indent) || 0;
    const next = Math.min(MAX_INDENT, Math.max(0, current + delta));
    if (next === current) return true;
    tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
    modified = true;
    return true;
  });
  return modified;
}

export const Indent = Extension.create({
  name: 'indent',

  addGlobalAttributes() {
    return [
      {
        types: INDENT_TYPES,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (el) => readIndent(el),
            renderHTML: (attrs) => {
              const n = Number(attrs.indent) || 0;
              if (n <= 0) return {};
              return { 'data-indent': String(Math.min(MAX_INDENT, n)) };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ state, dispatch, tr, editor }) => {
          if (editor.isActive('table')) return false;
          if (editor.isActive('listItem')) {
            editor.commands.sinkListItem('listItem');
            return true;
          }
          const modified = applyIndentDelta(state, tr, 1);
          if (modified && dispatch) dispatch(tr.scrollIntoView());
          return true;
        },
      outdent:
        () =>
        ({ state, dispatch, tr, editor }) => {
          if (editor.isActive('table')) return false;
          if (editor.isActive('listItem')) {
            editor.commands.liftListItem('listItem');
            return true;
          }
          const modified = applyIndentDelta(state, tr, -1);
          if (modified && dispatch) dispatch(tr.scrollIntoView());
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive('table')) {
          if (this.editor.commands.goToNextCell()) return true;
          if (!this.editor.can().addRowAfter()) return false;
          return this.editor.chain().addRowAfter().goToNextCell().run();
        }
        return this.editor.commands.indent();
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('table')) {
          return this.editor.commands.goToPreviousCell();
        }
        return this.editor.commands.outdent();
      },
    };
  },
});
