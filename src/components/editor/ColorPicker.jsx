'use client';

import { useState, useEffect, useRef } from 'react';

const COLORS = [
  { hex: '#000000', name: '검정' },
  { hex: '#374151', name: '짙은 회색' },
  { hex: '#6b7280', name: '회색' },
  { hex: '#9ca3af', name: '밝은 회색' },
  { hex: '#e5e7eb', name: '연한 회색' },
  { hex: '#dc2626', name: '빨강' },
  { hex: '#ea580c', name: '주황' },
  { hex: '#d97706', name: '황금색' },
  { hex: '#ca8a04', name: '노랑' },
  { hex: '#16a34a', name: '초록' },
  { hex: '#059669', name: '에메랄드' },
  { hex: '#0891b2', name: '청록' },
  { hex: '#2563eb', name: '파랑' },
  { hex: '#124fa6', name: '짙은 파랑' },
  { hex: '#7c3aed', name: '보라' },
  { hex: '#a21caf', name: '자주' },
  { hex: '#db2777', name: '분홍' },
  { hex: '#e11d48', name: '로즈' },
  { hex: '#065f46', name: '숲 초록' },
  { hex: '#1e3a5f', name: '남색' },
];

export default function ColorPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentColor = editor?.getAttributes('textStyle')?.color ?? null;

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

  return (
    <div className="ep-color-wrap" ref={ref}>
      <button
        type="button"
        title="글자 색상"
        aria-label="글자 색상"
        className={`ep-toolbar__btn${open ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <span className="ep-color-icon">
          <svg width="13" height="12" viewBox="0 0 13 12" fill="none" aria-hidden="true">
            <text
              x="0"
              y="11"
              fontSize="13"
              fontWeight="800"
              fontFamily="Georgia, serif"
              fill="currentColor"
            >
              A
            </text>
          </svg>
          <span
            className="ep-color-icon__bar"
            style={{ background: currentColor ?? 'currentColor' }}
          />
        </span>
      </button>

      {open && (
        <div className="cp" role="dialog" aria-label="글자 색상 선택">
          <p className="cp__label">글자 색상</p>
          <div className="cp__grid">
            {COLORS.map(({ hex, name }) => (
              <button
                key={hex}
                type="button"
                title={name}
                aria-label={name}
                className={`cp__swatch${currentColor === hex ? ' cp__swatch--on' : ''}`}
                style={{ background: hex }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().setColor(hex).run();
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="cp__reset"
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().unsetColor().run();
              setOpen(false);
            }}
          >
            색상 해제
          </button>
        </div>
      )}
    </div>
  );
}
