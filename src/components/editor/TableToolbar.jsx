import icons from './icons';
import { ToolbarBtn, Divider } from './ToolbarBtn';
import CellColorPicker from './CellColorPicker';
import CellBorderPicker from './CellBorderPicker';

/**
 * 표(Table) 활성 시에만 렌더링되는 툴바 확장 영역.
 * RichEditor 툴바 끝에 조건부로 마운트됩니다.
 */
export default function TableToolbar({ editor }) {
  if (!editor?.isActive('table')) return null;

  return (
    <>
      <Divider />
      <div className="ep-toolbar__group">
        <ToolbarBtn title="위에 행 삽입"    onClick={() => editor.chain().focus().addRowBefore().run()}>{icons.rowBefore}</ToolbarBtn>
        <ToolbarBtn title="아래에 행 삽입"  onClick={() => editor.chain().focus().addRowAfter().run()}>{icons.rowAfter}</ToolbarBtn>
        <ToolbarBtn title="행 삭제"         onClick={() => editor.chain().focus().deleteRow().run()}>{icons.deleteRow}</ToolbarBtn>
      </div>
      <Divider />
      <div className="ep-toolbar__group">
        <ToolbarBtn title="왼쪽에 열 삽입"   onClick={() => editor.chain().focus().addColumnBefore().run()}>{icons.colBefore}</ToolbarBtn>
        <ToolbarBtn title="오른쪽에 열 삽입" onClick={() => editor.chain().focus().addColumnAfter().run()}>{icons.colAfter}</ToolbarBtn>
        <ToolbarBtn title="열 삭제"          onClick={() => editor.chain().focus().deleteColumn().run()}>{icons.deleteCol}</ToolbarBtn>
      </div>
      <Divider />
      <div className="ep-toolbar__group">
        <ToolbarBtn title="셀 병합" disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()}>{icons.mergeCells}</ToolbarBtn>
        <ToolbarBtn title="셀 분리" disabled={!editor.can().splitCell()}  onClick={() => editor.chain().focus().splitCell().run()}>{icons.splitCell}</ToolbarBtn>
      </div>
      <Divider />
      <div className="ep-toolbar__group">
        <ToolbarBtn title="표 삭제" onClick={() => editor.chain().focus().deleteTable().run()}>{icons.deleteTable}</ToolbarBtn>
      </div>
      <Divider />
      <div className="ep-toolbar__group">
        <CellColorPicker editor={editor} />
        <CellBorderPicker editor={editor} />
      </div>
    </>
  );
}
