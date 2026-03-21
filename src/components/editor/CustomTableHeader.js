import { TableHeader } from '@tiptap/extension-table-header';

const BORDER_SIDES = {
  borderTop:    { data: 'data-border-top',    css: 'border-top'    },
  borderRight:  { data: 'data-border-right',  css: 'border-right'  },
  borderBottom: { data: 'data-border-bottom', css: 'border-bottom' },
  borderLeft:   { data: 'data-border-left',   css: 'border-left'   },
};

function makeSideAttr(side) {
  const { data, css } = BORDER_SIDES[side];
  return {
    default: null,
    parseHTML: (el) => el.getAttribute(data) || null,
    renderHTML: (attrs) =>
      attrs[side]
        ? { [data]: attrs[side], style: `${css}: ${attrs[side]}` }
        : {},
  };
}

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-cell-bgcolor') || null,
        renderHTML: (attrs) =>
          attrs.backgroundColor
            ? { 'data-cell-bgcolor': attrs.backgroundColor, style: `background-color: ${attrs.backgroundColor}` }
            : {},
      },
      borderTop:    makeSideAttr('borderTop'),
      borderRight:  makeSideAttr('borderRight'),
      borderBottom: makeSideAttr('borderBottom'),
      borderLeft:   makeSideAttr('borderLeft'),
    };
  },
});
