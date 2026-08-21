const BORDER_SIDES = {
  borderTop:    { data: 'data-border-top',    css: 'border-top'    },
  borderRight:  { data: 'data-border-right',  css: 'border-right'  },
  borderBottom: { data: 'data-border-bottom', css: 'border-bottom' },
  borderLeft:   { data: 'data-border-left',   css: 'border-left'   },
};

export const TEXT_ALIGNS = new Set(['left', 'center', 'right']);
export const VERTICAL_ALIGNS = new Set(['top', 'middle', 'bottom']);

export function normalizeTextAlign(value) {
  return TEXT_ALIGNS.has(value) ? value : null;
}

export function normalizeVerticalAlign(value) {
  return VERTICAL_ALIGNS.has(value) ? value : 'top';
}

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

/**
 * td/th 공통 속성 (배경, 테두리, 가로·세로 정렬)
 * @param {object} parentAttrs
 */
export function buildCellAttributes(parentAttrs) {
  return {
    ...parentAttrs,
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
    textAlign: {
      default: null,
      parseHTML: (el) => {
        const data = el.getAttribute('data-text-align');
        if (TEXT_ALIGNS.has(data)) return data;
        const styleAlign = el.style?.textAlign;
        return TEXT_ALIGNS.has(styleAlign) ? styleAlign : null;
      },
      renderHTML: (attrs) =>
        attrs.textAlign
          ? { 'data-text-align': attrs.textAlign, style: `text-align: ${attrs.textAlign}` }
          : {},
    },
    verticalAlign: {
      default: null,
      parseHTML: (el) => {
        const data = el.getAttribute('data-vertical-align');
        if (data === 'middle' || data === 'bottom') return data;
        const styleAlign = el.style?.verticalAlign;
        if (styleAlign === 'middle' || styleAlign === 'bottom') return styleAlign;
        return null;
      },
      renderHTML: (attrs) => {
        const v = attrs.verticalAlign;
        if (!v || v === 'top') return {};
        return { 'data-vertical-align': v, style: `vertical-align: ${v}` };
      },
    },
  };
}

export function getActiveCellAttrs(editor) {
  if (!editor) return {};
  if (editor.isActive('tableHeader')) return editor.getAttributes('tableHeader');
  if (editor.isActive('tableCell')) return editor.getAttributes('tableCell');
  return {};
}

export function setSelectedCellAttr(editor, name, value) {
  if (!editor) return;
  const next = name === 'verticalAlign' && value === 'top' ? null : value;
  const chain = editor.chain().focus().setCellAttribute(name, next);
  if (name === 'textAlign' && TEXT_ALIGNS.has(value)) {
    chain.setTextAlign(value);
  }
  chain.run();
}

export function currentRowIsHeader(editor) {
  if (!editor) return false;
  const { selection } = editor.state;
  const $from = selection.$from;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const node = $from.node(depth);
    if (node.type.name !== 'tableRow') continue;
    if (node.childCount === 0) return false;
    let allHeader = true;
    node.forEach((cell) => {
      if (cell.type.name !== 'tableHeader') allHeader = false;
    });
    return allHeader;
  }
  return false;
}
