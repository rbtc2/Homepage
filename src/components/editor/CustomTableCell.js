import { TableCell } from '@tiptap/extension-table-cell';
import { buildCellAttributes } from './table-cell-attrs';

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return buildCellAttributes(this.parent?.() ?? {});
  },
});
