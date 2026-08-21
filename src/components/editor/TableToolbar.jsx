'use client';

import { useEffect, useState } from 'react';
import icons from './icons';
import { ToolbarBtn, Divider } from './ToolbarBtn';
import CellColorPicker from './CellColorPicker';
import CellBorderPicker from './CellBorderPicker';
import {
  formatTableWidth,
  MAX_TABLE_PERCENT,
  MAX_TABLE_PX,
  MIN_TABLE_PERCENT,
  MIN_TABLE_PX,
  normalizeAlign,
  parseTableWidth,
} from './CustomTable';

const WIDTH_PRESETS = [50, 75, 100];

function getEditorContentWidth(editor) {
  const el = editor?.view?.dom;
  if (!(el instanceof HTMLElement)) return 800;
  const style = window.getComputedStyle(el);
  const pad =
    (Number.parseFloat(style.paddingLeft) || 0) +
    (Number.parseFloat(style.paddingRight) || 0);
  return Math.max(200, el.clientWidth - pad);
}

function convertWidth(amount, fromUnit, toUnit, editor) {
  if (fromUnit === toUnit) {
    return formatTableWidth(`${amount}${toUnit}`);
  }
  const contentWidth = getEditorContentWidth(editor);
  if (toUnit === 'px') {
    return formatTableWidth(`${Math.round((amount / 100) * contentWidth)}px`);
  }
  return formatTableWidth(`${Math.round((amount / contentWidth) * 100)}%`);
}

/**
 * 표(Table) 활성 시에만 렌더링되는 툴바 확장 영역.
 * RichEditor 툴바 끝에 조건부로 마운트됩니다.
 */
export default function TableToolbar({ editor }) {
  const [widthDraft, setWidthDraft] = useState('100');
  const [widthUnit, setWidthUnit] = useState('%');
  const [editingWidth, setEditingWidth] = useState(false);

  const inTable = Boolean(editor?.isActive('table'));
  const tableAttrs = inTable ? editor.getAttributes('table') : {};
  const formattedWidth = formatTableWidth(tableAttrs.width);
  const align = normalizeAlign(tableAttrs.align);
  const parsed = parseTableWidth(formattedWidth);

  useEffect(() => {
    if (editingWidth) return;
    setWidthDraft(String(parsed.amount));
    setWidthUnit(parsed.unit);
  }, [editingWidth, parsed.amount, parsed.unit]);

  if (!editor || (!inTable && !editingWidth)) return null;

  const applyWidth = (next) => {
    editor.chain().focus().setTableWidth(next).run();
  };

  const applyWidthDraft = () => {
    const amount = Number.parseInt(String(widthDraft), 10);
    if (Number.isNaN(amount)) {
      setWidthDraft(String(parsed.amount));
      setWidthUnit(parsed.unit);
      return;
    }
    applyWidth(`${amount}${widthUnit}`);
  };

  const toggleUnit = () => {
    const nextUnit = widthUnit === '%' ? 'px' : '%';
    const amount = Number.parseInt(String(widthDraft), 10);
    const safeAmount = Number.isNaN(amount) ? parsed.amount : amount;
    const next = convertWidth(safeAmount, widthUnit, nextUnit, editor);
    applyWidth(next);
    const converted = parseTableWidth(next);
    setWidthDraft(String(converted.amount));
    setWidthUnit(converted.unit);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyWidthDraft();
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setWidthDraft(String(parsed.amount));
      setWidthUnit(parsed.unit);
      e.currentTarget.blur();
    }
  };

  const min = widthUnit === '%' ? MIN_TABLE_PERCENT : MIN_TABLE_PX;
  const max = widthUnit === '%' ? MAX_TABLE_PERCENT : MAX_TABLE_PX;

  return (
    <>
      <Divider />
      <div className="ep-toolbar__group">
        {WIDTH_PRESETS.map((pct) => (
          <ToolbarBtn
            key={pct}
            title={`표 너비 ${pct}%`}
            active={parsed.unit === '%' && parsed.amount === pct}
            onClick={() => applyWidth(`${pct}%`)}
          >
            <span className="ep-toolbar__label">{pct}%</span>
          </ToolbarBtn>
        ))}
        <label className="ep-tbl-toolbar__field">
          <span className="ep-tbl-toolbar__field-label">너비</span>
          <input
            type="number"
            className="ep-tbl-toolbar__input"
            min={min}
            max={max}
            step={1}
            value={widthDraft}
            onFocus={() => {
              setEditingWidth(true);
              setWidthDraft(String(parsed.amount));
              setWidthUnit(parsed.unit);
            }}
            onChange={(e) => setWidthDraft(e.target.value)}
            onBlur={() => {
              applyWidthDraft();
              setEditingWidth(false);
            }}
            onKeyDown={handleInputKeyDown}
            aria-label={`표 너비 (${widthUnit})`}
            title="Enter로 적용"
          />
          <button
            type="button"
            className="ep-tbl-toolbar__unit"
            title={widthUnit === '%' ? '픽셀로 전환' : '퍼센트로 전환'}
            aria-label={widthUnit === '%' ? '단위: 퍼센트. 픽셀로 전환' : '단위: 픽셀. 퍼센트로 전환'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleUnit}
          >
            {widthUnit}
          </button>
        </label>
      </div>
      <Divider />
      <div className="ep-toolbar__group">
        <ToolbarBtn
          title="표 왼쪽 정렬"
          active={align === 'left'}
          onClick={() => editor.chain().focus().setTableAlign('left').run()}
        >
          {icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          title="표 가운데 정렬"
          active={align === 'center'}
          onClick={() => editor.chain().focus().setTableAlign('center').run()}
        >
          {icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          title="표 오른쪽 정렬"
          active={align === 'right'}
          onClick={() => editor.chain().focus().setTableAlign('right').run()}
        >
          {icons.alignRight}
        </ToolbarBtn>
      </div>
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
