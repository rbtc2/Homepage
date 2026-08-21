'use client';

import { Table, TableView } from '@tiptap/extension-table';

const ALIGNMENTS = new Set(['left', 'center', 'right']);

export const MIN_TABLE_PERCENT = 20;
export const MAX_TABLE_PERCENT = 100;
export const MIN_TABLE_PX = 120;
export const MAX_TABLE_PX = 2400;

export function normalizeAlign(value) {
  return ALIGNMENTS.has(value) ? value : 'left';
}

/**
 * @param {unknown} value
 * @returns {{ unit: '%' | 'px', amount: number }}
 */
export function parseTableWidth(value) {
  if (value == null || value === '') {
    return { unit: '%', amount: 100 };
  }
  const s = String(value).trim();
  const pct = s.match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (pct) {
    const amount = Math.min(
      MAX_TABLE_PERCENT,
      Math.max(MIN_TABLE_PERCENT, Math.round(Number(pct[1])))
    );
    return { unit: '%', amount };
  }
  const px = s.match(/^(\d+(?:\.\d+)?)\s*px$/i) ?? s.match(/^(\d+)$/);
  if (px) {
    const amount = Math.min(
      MAX_TABLE_PX,
      Math.max(MIN_TABLE_PX, Math.round(Number(px[1])))
    );
    return { unit: 'px', amount };
  }
  return { unit: '%', amount: 100 };
}

export function formatTableWidth(value) {
  const { unit, amount } = parseTableWidth(value);
  return `${amount}${unit}`;
}

function readWidthFromElement(el) {
  const data = el.getAttribute('data-width');
  if (data) return formatTableWidth(data);
  const styleWidth = el.style?.width;
  if (styleWidth) return formatTableWidth(styleWidth);
  return '100%';
}

/**
 * 열 너비 합산이 표 전체 폭을 덮어쓰지 않도록, 갱신 후 width/align을 다시 적용합니다.
 */
class CustomTableView extends TableView {
  constructor(node, cellMinWidth) {
    super(node, cellMinWidth);
    this.applyLayout(node);
  }

  update(node) {
    const result = super.update(node);
    if (result) this.applyLayout(node);
    return result;
  }

  applyLayout(node) {
    const width = formatTableWidth(node.attrs.width);
    const align = normalizeAlign(node.attrs.align);
    this.dom.className = `tableWrapper tableWrapper--${align}`;
    this.dom.dataset.align = align;
    this.table.dataset.width = width;
    this.table.dataset.align = align;
    this.table.style.width = width;
    this.table.style.maxWidth = '100%';
  }
}

export const CustomTable = Table.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      View: CustomTableView,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (el) => readWidthFromElement(el),
        renderHTML: (attrs) => {
          const width = formatTableWidth(attrs.width);
          return {
            'data-width': width,
            style: `width: ${width}; max-width: 100%`,
          };
        },
      },
      align: {
        default: 'left',
        parseHTML: (el) => normalizeAlign(el.getAttribute('data-align')),
        renderHTML: (attrs) => ({
          'data-align': normalizeAlign(attrs.align),
        }),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTableWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { width: formatTableWidth(width) }),
      setTableAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { align: normalizeAlign(align) }),
    };
  },
});
