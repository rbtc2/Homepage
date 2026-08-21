'use client';

import { useEffect, useRef, useState } from 'react';

export const FONT_SIZE_PRESETS = [
  { value: null, label: '기본' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '21px', label: '21' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '36px', label: '36' },
];

function normalizeSize(value) {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d+(?:\.\d+)?)px$/i);
  if (!match) return null;
  return `${Math.round(Number(match[1]))}px`;
}

export default function FontSizePicker({ editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = normalizeSize(editor?.getAttributes('textStyle')?.fontSize);
  const currentLabel =
    FONT_SIZE_PRESETS.find((item) => item.value === current)?.label ??
    (current ? current.replace('px', '') : '기본');

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

  const apply = (value) => {
    if (!editor) return;
    if (!value) editor.chain().focus().unsetFontSize().run();
    else editor.chain().focus().setFontSize(value).run();
    setOpen(false);
  };

  return (
    <div className="ep-fs-wrap" ref={ref}>
      <button
        type="button"
        title="글자 크기"
        aria-label="글자 크기"
        aria-expanded={open}
        className={`ep-toolbar__btn ep-fs-btn${open || current ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <span className="ep-fs-btn__label">{currentLabel}</span>
      </button>
      {open ? (
        <div className="ep-fs" role="listbox" aria-label="글자 크기 선택">
          {FONT_SIZE_PRESETS.map((item) => (
            <button
              key={item.label}
              type="button"
              role="option"
              aria-selected={current === item.value}
              className={`ep-fs__item${current === item.value ? ' ep-fs__item--on' : ''}`}
              style={item.value ? { fontSize: item.value } : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                apply(item.value);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
