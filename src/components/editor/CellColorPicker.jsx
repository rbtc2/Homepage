'use client';

import { useState, useEffect, useRef } from 'react';

const BG_COLORS = [
  { hex: '#ffffff', name: '흰색' },
  { hex: '#fef9c3', name: '연한 노랑' },
  { hex: '#fef3c7', name: '연한 황금' },
  { hex: '#fed7aa', name: '연한 주황' },
  { hex: '#fecaca', name: '연한 빨강' },
  { hex: '#fce7f3', name: '연한 분홍' },
  { hex: '#ede9fe', name: '연한 보라' },
  { hex: '#dbeafe', name: '연한 파랑' },
  { hex: '#cffafe', name: '연한 청록' },
  { hex: '#dcfce7', name: '연한 초록' },
  { hex: '#f1f5f9', name: '연한 회색' },
  { hex: '#e2e8f0', name: '회색' },
  { hex: '#1e293b', name: '짙은 네이비' },
  { hex: '#374151', name: '짙은 회색' },
  { hex: '#000000', name: '검정' },
];

function isValidHex(val) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);
}

export default function CellColorPicker({ editor }) {
  const [open,        setOpen]        = useState(false);
  const [customColor, setCustomColor] = useState('');
  const ref = useRef(null);

  const currentVal = editor
    ? (editor.isActive('tableHeader')
        ? editor.getAttributes('tableHeader').backgroundColor
        : editor.getAttributes('tableCell').backgroundColor) ?? null
    : null;

  const handleOpen = () => {
    setCustomColor(currentVal ?? '');
    setOpen((o) => !o);
  };

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

  const applyColor = (color) => {
    if (!editor) return;
    const nodeType = editor.isActive('tableHeader') ? 'tableHeader' : 'tableCell';
    editor.chain().focus().updateAttributes(nodeType, { backgroundColor: color }).run();
    setOpen(false);
  };

  const resetColor = () => {
    if (!editor) return;
    const nodeType = editor.isActive('tableHeader') ? 'tableHeader' : 'tableCell';
    editor.chain().focus().updateAttributes(nodeType, { backgroundColor: null }).run();
    setOpen(false);
  };

  const applyCustom = () => {
    if (!isValidHex(customColor)) return;
    applyColor(customColor);
  };

  const handleHexInput = (e) => {
    let val = e.target.value;
    if (val && !val.startsWith('#')) val = '#' + val;
    setCustomColor(val.slice(0, 7));
  };

  const nativeValue = isValidHex(customColor)
    ? (customColor.length === 4
        ? '#' + [...customColor.slice(1)].map((c) => c + c).join('')
        : customColor)
    : (currentVal ?? '#ffffff');

  return (
    <div className="ep-color-wrap" ref={ref}>
      <button
        type="button"
        title="셀 배경색"
        aria-label="셀 배경색"
        className={`ep-toolbar__btn${open ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); handleOpen(); }}
      >
        <span className="ep-color-icon">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="12" height="8" rx="1.2"
              fill="currentColor" fillOpacity="0.18"
              stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span
            className="ep-color-icon__bar"
            style={{
              background: currentVal ?? 'transparent',
              border: !currentVal ? '1px solid var(--line)' : 'none',
            }}
          />
        </span>
      </button>

      {open && (
        <div className="cp" role="dialog" aria-label="셀 배경색 선택">
          <p className="cp__label">셀 배경색</p>
          <div className="cp__grid">
            {BG_COLORS.map(({ hex, name }) => (
              <button
                key={hex}
                type="button"
                title={name}
                aria-label={name}
                className={`cp__swatch${currentVal === hex ? ' cp__swatch--on' : ''}`}
                style={{ background: hex }}
                onMouseDown={(e) => { e.preventDefault(); applyColor(hex); }}
              />
            ))}
          </div>
          <div className="cp__custom">
            <input
              type="color"
              className="cp__native-input"
              value={nativeValue}
              onChange={(e) => setCustomColor(e.target.value)}
              title="컬러 피커"
            />
            <input
              type="text"
              className="cp__hex-input"
              value={customColor}
              maxLength={7}
              placeholder="#ffffff"
              spellCheck={false}
              onChange={handleHexInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyCustom(); }
              }}
            />
            <button
              type="button"
              className="cp__custom-apply"
              disabled={!isValidHex(customColor)}
              onMouseDown={(e) => { e.preventDefault(); applyCustom(); }}
            >
              적용
            </button>
          </div>
          <button
            type="button"
            className="cp__reset"
            onMouseDown={(e) => { e.preventDefault(); resetColor(); }}
          >
            색상 해제
          </button>
        </div>
      )}
    </div>
  );
}
