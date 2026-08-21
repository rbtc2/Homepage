import { TableHeader } from '@tiptap/extension-table-header';
import { buildCellAttributes } from './table-cell-attrs';

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return buildCellAttributes(this.parent?.() ?? {});
  },
});
