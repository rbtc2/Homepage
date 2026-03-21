'use client';

import { useState, useEffect, useRef } from 'react';

const ALL_SIDES = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

const PRESET_COLORS = [
  '#000000', '#374151', '#6b7280', '#9ca3af',
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
  '#0891b2', '#2563eb', '#7c3aed', '#db2777',
];

const WIDTHS = [
  { value: '1px', label: '얇게' },
  { value: '2px', label: '보통' },
  { value: '3px', label: '굵게' },
];

const LINE_STYLES = [
  { value: 'solid',  label: '실선' },
  { value: 'dashed', label: '점선' },
  { value: 'dotted', label: '쇄선' },
];

const POSITIONS = [
  { sides: ALL_SIDES,             label: '전체',   full: true },
  { sides: ['borderTop'],         label: '▲ 위',   full: false },
  { sides: ['borderBottom'],      label: '▼ 아래', full: false },
  { sides: ['borderLeft'],        label: '◀ 왼쪽', full: false },
  { sides: ['borderRight'],       label: '오른쪽 ▶', full: false },
];

function isValidHex(val) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);
}

function expandHex(hex) {
  if (hex.length === 4) {
    return '#' + [...hex.slice(1)].map((c) => c + c).join('');
  }
  return hex;
}

export default function CellBorderPicker({ editor }) {
  const [open,      setOpen]      = useState(false);
  const [color,     setColor]     = useState('#000000');
  const [hexInput,  setHexInput]  = useState('#000000');
  const [width,     setWidth]     = useState('1px');
  const [lineStyle, setLineStyle] = useState('solid');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleHexInput = (e) => {
    let val = e.target.value;
    if (val && !val.startsWith('#')) val = '#' + val;
    val = val.slice(0, 7);
    setHexInput(val);
    if (isValidHex(val)) setColor(val);
  };

  const handleNativeChange = (e) => {
    setColor(e.target.value);
    setHexInput(e.target.value);
  };

  const selectPreset = (c) => {
    setColor(c);
    setHexInput(c);
  };

  const getNodeType = () =>
    editor?.isActive('tableHeader') ? 'tableHeader' : 'tableCell';

  const applyTo = (sides) => {
    if (!editor) return;
    const borderValue = `${width} ${lineStyle} ${color}`;
    const attrs = Object.fromEntries(sides.map((s) => [s, borderValue]));
    editor.chain().focus().updateAttributes(getNodeType(), attrs).run();
    setOpen(false);
  };

  const resetBorders = () => {
    if (!editor) return;
    const attrs = Object.fromEntries(ALL_SIDES.map((s) => [s, null]));
    editor.chain().focus().updateAttributes(getNodeType(), attrs).run();
    setOpen(false);
  };

  const nativeValue = isValidHex(hexInput) ? expandHex(hexInput) : color;

  return (
    <div className="ep-color-wrap" ref={ref}>
      <button
        type="button"
        title="셀 테두리"
        aria-label="셀 테두리"
        className={`ep-toolbar__btn${open ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); }}
      >
        <span className="ep-color-icon">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="11" height="7" rx="1"
              stroke="currentColor" strokeWidth="2.2"/>
          </svg>
          <span className="ep-color-icon__bar" style={{ background: color }} />
        </span>
      </button>

      {open && (
        <div className="cbp" role="dialog" aria-label="셀 테두리 설정">

          {/* ── 색상 ── */}
          <p className="cbp__label">색상</p>
          <div className="cbp__color-row">
            <input
              type="color"
              className="cp__native-input"
              value={nativeValue}
              onChange={handleNativeChange}
              title="컬러 피커"
            />
            <input
              type="text"
              className="cp__hex-input cbp__hex"
              value={hexInput}
              maxLength={7}
              placeholder="#000000"
              spellCheck={false}
              onChange={handleHexInput}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            />
            <span className="cbp__color-preview" style={{ background: color }} />
          </div>
          <div className="cbp__presets">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                className={`cp__swatch cbp__preset${color === c ? ' cp__swatch--on' : ''}`}
                style={{ background: c }}
                onMouseDown={(e) => { e.preventDefault(); selectPreset(c); }}
              />
            ))}
          </div>

          {/* ── 굵기 ── */}
          <p className="cbp__label">굵기</p>
          <div className="cbp__options-row">
            {WIDTHS.map((w) => (
              <button
                key={w.value}
                type="button"
                className={`cbp__opt-btn${width === w.value ? ' cbp__opt-btn--on' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); setWidth(w.value); }}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* ── 선 종류 ── */}
          <p className="cbp__label">선 종류</p>
          <div className="cbp__options-row">
            {LINE_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`cbp__opt-btn${lineStyle === s.value ? ' cbp__opt-btn--on' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); setLineStyle(s.value); }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ── 적용 위치 ── */}
          <p className="cbp__label">적용 위치</p>
          <div className="cbp__pos-grid">
            {POSITIONS.map(({ sides, label, full }) => (
              <button
                key={label}
                type="button"
                className={`cbp__pos-btn${full ? ' cbp__pos-btn--full' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); applyTo(sides); }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── 해제 ── */}
          <button
            type="button"
            className="cp__reset"
            onMouseDown={(e) => { e.preventDefault(); resetBorders(); }}
          >
            테두리 해제
          </button>
        </div>
      )}
    </div>
  );
}
