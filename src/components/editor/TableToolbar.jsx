'use client';

import { useEffect, useState } from 'react';
import icons from './icons';
import { ToolbarBtn, Divider } from './ToolbarBtn';
import CellColorPicker from './CellColorPicker';
import CellBorderPicker from './CellBorderPicker';
import {
  formatTableWidth,
  isTablePresetActive,
  MAX_TABLE_PERCENT,
  MAX_TABLE_PX,
  MIN_TABLE_PERCENT,
  MIN_TABLE_PX,
  normalizeAlign,
  parseTableWidth,
  TABLE_PRESETS,
} from './CustomTable';
import {
  currentRowIsHeader,
  getActiveCellAttrs,
  normalizeTextAlign,
  normalizeVerticalAlign,
  setSelectedCellAttr,
} from './table-cell-attrs';
import { MAX_ROW_HEIGHT, MIN_ROW_HEIGHT, parseRowHeight } from './CustomTableRow';

const TABLE_PRESET_KEYS = ['narrow', 'medium', 'full'];

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
 * 표 선택 시에만 메인 툴바 아래에 붙는 표 전용 도구 줄.
 */
export default function TableToolbar({ editor }) {
  const [widthDraft, setWidthDraft] = useState('100');
  const [widthUnit, setWidthUnit] = useState('%');
  const [editingWidth, setEditingWidth] = useState(false);
  const [heightDraft, setHeightDraft] = useState('');
  const [editingHeight, setEditingHeight] = useState(false);

  const inTable = Boolean(editor?.isActive('table'));
  const tableAttrs = inTable ? editor.getAttributes('table') : {};
  const formattedWidth = formatTableWidth(tableAttrs.width);
  const align = normalizeAlign(tableAttrs.align);
  const parsed = parseTableWidth(formattedWidth);
  const cellAttrs = inTable ? getActiveCellAttrs(editor) : {};
  const cellTextAlign = normalizeTextAlign(cellAttrs.textAlign) ?? 'left';
  const cellVerticalAlign = normalizeVerticalAlign(cellAttrs.verticalAlign);
  const rowHeight = inTable ? parseRowHeight(editor.getAttributes('tableRow').height) : null;
  const headerRowOn = inTable ? currentRowIsHeader(editor) : false;

  useEffect(() => {
    if (editingWidth) return;
    setWidthDraft(String(parsed.amount));
    setWidthUnit(parsed.unit);
  }, [editingWidth, parsed.amount, parsed.unit]);

  useEffect(() => {
    if (editingHeight) return;
    setHeightDraft(rowHeight != null ? String(rowHeight) : '');
  }, [editingHeight, rowHeight]);

  if (!editor || (!inTable && !editingWidth && !editingHeight)) return null;

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

  const applyHeightDraft = () => {
    const raw = String(heightDraft).trim();
    if (!raw) {
      editor.chain().focus().setTableRowHeight(null).run();
      return;
    }
    const next = parseRowHeight(raw);
    if (next == null) {
      setHeightDraft(rowHeight != null ? String(rowHeight) : '');
      return;
    }
    editor.chain().focus().setTableRowHeight(next).run();
    setHeightDraft(String(next));
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

  const handleWidthKeyDown = (e) => {
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

  const handleHeightKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyHeightDraft();
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setHeightDraft(rowHeight != null ? String(rowHeight) : '');
      e.currentTarget.blur();
    }
  };

  const min = widthUnit === '%' ? MIN_TABLE_PERCENT : MIN_TABLE_PX;
  const max = widthUnit === '%' ? MAX_TABLE_PERCENT : MAX_TABLE_PX;

  return (
    <div className="ep-tbl-bar" role="toolbar" aria-label="표 서식">
      <div className="ep-toolbar__group">
        {TABLE_PRESET_KEYS.map((key) => (
          <ToolbarBtn
            key={key}
            title={`${TABLE_PRESETS[key].label} (${TABLE_PRESETS[key].width})`}
            active={isTablePresetActive(tableAttrs.width, tableAttrs.align, key)}
            onClick={() => editor.chain().focus().setTablePreset(key).run()}
          >
            <span className="ep-toolbar__label">{TABLE_PRESETS[key].label}</span>
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
            onKeyDown={handleWidthKeyDown}
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
      <div className="ep-tbl-toolbar__cluster">
        <span className="ep-tbl-toolbar__caption">표</span>
        <ToolbarBtn
          title="표 왼쪽 정렬"
          active={align === 'left'}
          onClick={() => editor.chain().focus().setTableAlign('left').run()}
        >
          {icons.tableAlignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          title="표 가운데 정렬"
          active={align === 'center'}
          onClick={() => editor.chain().focus().setTableAlign('center').run()}
        >
          {icons.tableAlignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          title="표 오른쪽 정렬"
          active={align === 'right'}
          onClick={() => editor.chain().focus().setTableAlign('right').run()}
        >
          {icons.tableAlignRight}
        </ToolbarBtn>
      </div>
      <Divider />
      <div className="ep-tbl-toolbar__cluster">
        <span className="ep-tbl-toolbar__caption">셀</span>
        <ToolbarBtn
          title="셀 왼쪽 정렬"
          active={cellTextAlign === 'left'}
          onClick={() => setSelectedCellAttr(editor, 'textAlign', 'left')}
        >
          {icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          title="셀 가운데 정렬"
          active={cellTextAlign === 'center'}
          onClick={() => setSelectedCellAttr(editor, 'textAlign', 'center')}
        >
          {icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          title="셀 오른쪽 정렬"
          active={cellTextAlign === 'right'}
          onClick={() => setSelectedCellAttr(editor, 'textAlign', 'right')}
        >
          {icons.alignRight}
        </ToolbarBtn>
        <ToolbarBtn
          title="셀 위쪽 정렬"
          active={cellVerticalAlign === 'top'}
          onClick={() => setSelectedCellAttr(editor, 'verticalAlign', 'top')}
        >
          {icons.valignTop}
        </ToolbarBtn>
        <ToolbarBtn
          title="셀 세로 가운데 정렬"
          active={cellVerticalAlign === 'middle'}
          onClick={() => setSelectedCellAttr(editor, 'verticalAlign', 'middle')}
        >
          {icons.valignMiddle}
        </ToolbarBtn>
        <ToolbarBtn
          title="셀 아래쪽 정렬"
          active={cellVerticalAlign === 'bottom'}
          onClick={() => setSelectedCellAttr(editor, 'verticalAlign', 'bottom')}
        >
          {icons.valignBottom}
        </ToolbarBtn>
      </div>
      <Divider />
      <div className="ep-toolbar__group">
        <label className="ep-tbl-toolbar__field">
          <span className="ep-tbl-toolbar__field-label">행 높이</span>
          <input
            type="number"
            className="ep-tbl-toolbar__input"
            min={MIN_ROW_HEIGHT}
            max={MAX_ROW_HEIGHT}
            step={1}
            value={heightDraft}
            placeholder="자동"
            onFocus={() => {
              setEditingHeight(true);
              setHeightDraft(rowHeight != null ? String(rowHeight) : '');
            }}
            onChange={(e) => setHeightDraft(e.target.value)}
            onBlur={() => {
              applyHeightDraft();
              setEditingHeight(false);
            }}
            onKeyDown={handleHeightKeyDown}
            aria-label="행 높이 px"
            title="비우면 자동 · Enter로 적용"
          />
          <span className="ep-tbl-toolbar__unit-text">px</span>
        </label>
        <ToolbarBtn
          title="헤더 행 켜기/끄기"
          active={headerRowOn}
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        >
          {icons.headerRow}
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
        <ToolbarBtn title="표 삭제" onClick={() => editor.chain().focus().deleteTable().run()}>{icons.deleteTable}</ToolbarBtn>
        <CellColorPicker editor={editor} />
        <CellBorderPicker editor={editor} />
      </div>
    </div>
  );
}
