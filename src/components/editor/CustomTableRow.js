import { TableRow } from '@tiptap/extension-table';

export const MIN_ROW_HEIGHT = 28;
export const MAX_ROW_HEIGHT = 400;

export function parseRowHeight(value) {
  if (value == null || value === '') return null;
  const n = Number.parseInt(String(value), 10);
  if (Number.isNaN(n) || n <= 0) return null;
  return Math.min(MAX_ROW_HEIGHT, Math.max(MIN_ROW_HEIGHT, n));
}

export const CustomTableRow = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: null,
        parseHTML: (el) => {
          const data = el.getAttribute('data-row-height');
          if (data) return parseRowHeight(data);
          const styleH = el.style?.height;
          if (styleH) return parseRowHeight(styleH);
          return null;
        },
        renderHTML: (attrs) => {
          const h = parseRowHeight(attrs.height);
          if (h == null) return {};
          return {
            'data-row-height': String(h),
            style: `height: ${h}px`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTableRowHeight:
        (height) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { height: parseRowHeight(height) }),
    };
  },
});
