'use client';

import { useState, useEffect, useRef } from 'react';

/** 형광펜용 밝은 배경색 (글자색 피커와 구분) */
const HIGHLIGHT_COLORS = [
  { hex: '#fef08a', name: '노랑' },
  { hex: '#fde68a', name: '연노랑' },
  { hex: '#bbf7d0', name: '연두' },
  { hex: '#a7f3d0', name: '민트' },
  { hex: '#bfdbfe', name: '하늘' },
  { hex: '#c7d2fe', name: '연보라' },
  { hex: '#fbcfe8', name: '분홍' },
  { hex: '#fecaca', name: '연분홍' },
  { hex: '#fed7aa', name: '살구' },
  { hex: '#e9d5ff', name: '라벤더' },
  { hex: '#d9f99d', name: '라임' },
  { hex: '#e5e7eb', name: '회색' },
];

function isValidHex(val) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);
}

export default function HighlightPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const ref = useRef(null);

  const currentColor = editor?.getAttributes('highlight')?.color ?? null;

  const handleOpen = () => {
    setCustomColor(currentColor ?? '#fef08a');
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
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const applyCustom = () => {
    if (!isValidHex(customColor)) return;
    editor?.chain().focus().toggleHighlight({ color: customColor }).run();
    setOpen(false);
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
    : (currentColor ?? '#fef08a');

  return (
    <div className="ep-color-wrap" ref={ref}>
      <button
        type="button"
        title="형광펜 (배경 강조)"
        aria-label="형광펜"
        className={`ep-toolbar__btn${open || editor?.isActive('highlight') ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          handleOpen();
        }}
      >
        <span className="ep-hl-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 3l4 4-9 9-4-4 9-9z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M6 18l-2 4 4-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="ep-hl-icon__bar"
            style={{ background: currentColor ?? '#fef08a' }}
          />
        </span>
      </button>

      {open && (
        <div className="cp" role="dialog" aria-label="형광펜 색상 선택">
          <p className="cp__label">형광펜</p>

          <div className="cp__grid">
            {HIGHLIGHT_COLORS.map(({ hex, name }) => (
              <button
                key={hex}
                type="button"
                title={name}
                aria-label={name}
                className={`cp__swatch${currentColor === hex ? ' cp__swatch--on' : ''}`}
                style={{ background: hex }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleHighlight({ color: hex }).run();
                  setOpen(false);
                }}
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
              placeholder="#fef08a"
              spellCheck={false}
              onChange={handleHexInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyCustom();
                }
              }}
            />
            <button
              type="button"
              className="cp__custom-apply"
              disabled={!isValidHex(customColor)}
              onMouseDown={(e) => {
                e.preventDefault();
                applyCustom();
              }}
            >
              적용
            </button>
          </div>

          <button
            type="button"
            className="cp__reset"
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().unsetHighlight().run();
              setOpen(false);
            }}
          >
            형광펜 해제
          </button>
        </div>
      )}
    </div>
  );

}
