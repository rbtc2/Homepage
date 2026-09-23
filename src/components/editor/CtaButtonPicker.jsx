'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CTA_BUTTONS_MAX, normalizeCtaButtons } from './EditorCtaButtons';
import icons from './icons';

const EMPTY_ROW = { label: '', href: '' };

function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function createRows(count = 1) {
  return Array.from({ length: Math.min(Math.max(count, 1), CTA_BUTTONS_MAX) }, () => ({
    ...EMPTY_ROW,
  }));
}

/**
 * 본문 CTA 버튼(1~3개) 삽입·편집 피커.
 */
export default function CtaButtonPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(() => createRows(1));
  const [align, setAlign] = useState('center');
  const [hint, setHint] = useState(null);
  const wrapRef = useRef(null);
  const firstLabelRef = useRef(null);

  const isActive = editor?.isActive('editorCtaButtons') ?? false;

  const openPicker = useCallback(() => {
    setHint(null);
    if (editor?.isActive('editorCtaButtons')) {
      const attrs = editor.getAttributes('editorCtaButtons');
      const existing = normalizeCtaButtons(attrs.buttons);
      setRows(
        existing.length > 0
          ? existing.map((b) => ({ label: b.label, href: b.href }))
          : createRows(1)
      );
      setAlign(
        attrs.align === 'left' || attrs.align === 'right' ? attrs.align : 'center'
      );
    } else {
      setRows(createRows(1));
      setAlign('center');
    }
    setOpen(true);
    setTimeout(() => firstLabelRef.current?.focus(), 40);
  }, [editor]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
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

  const updateRow = useCallback((index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => {
      if (prev.length >= CTA_BUTTONS_MAX) return prev;
      return [...prev, { ...EMPTY_ROW }];
    });
    setHint(null);
  }, []);

  const removeRow = useCallback((index) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
    setHint(null);
  }, []);

  const apply = useCallback(() => {
    if (!editor) return;

    const buttons = normalizeCtaButtons(
      rows.map((row) => ({
        label: row.label.trim() || '바로가기',
        href: normalizeUrl(row.href),
      }))
    );

    if (buttons.length === 0) {
      setHint('URL이 있는 버튼을 1개 이상 입력해 주세요.');
      return;
    }

    if (editor.isActive('editorCtaButtons')) {
      editor.chain().focus().updateEditorCtaButtons({ buttons, align }).run();
    } else {
      editor.chain().focus().setEditorCtaButtons({ buttons, align }).run();
    }

    setOpen(false);
    setHint(null);
  }, [editor, rows, align]);

  return (
    <div className="ep-cta-picker-wrap" ref={wrapRef}>
      <button
        type="button"
        title={isActive ? '바로가기 버튼 편집' : '바로가기 버튼 삽입'}
        aria-label={isActive ? '바로가기 버튼 편집' : '바로가기 버튼 삽입'}
        className={`ep-toolbar__btn${isActive ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) setOpen(false);
          else openPicker();
        }}
      >
        {icons.ctaButton}
      </button>

      {open ? (
        <div className="ctp" role="dialog" aria-label="바로가기 버튼 설정">
          <p className="ctp__label">
            {isActive ? '바로가기 버튼 편집' : '바로가기 버튼 삽입'}
            <span className="ctp__meta">최대 {CTA_BUTTONS_MAX}개</span>
          </p>

          <div className="ctp__align" role="group" aria-label="버튼 정렬">
            {[
              { value: 'left', title: '왼쪽', icon: icons.alignLeft },
              { value: 'center', title: '가운데', icon: icons.alignCenter },
              { value: 'right', title: '오른쪽', icon: icons.alignRight },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.title}
                aria-label={opt.title}
                aria-pressed={align === opt.value}
                className={`ctp__align-btn${align === opt.value ? ' ctp__align-btn--on' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setAlign(opt.value);
                }}
              >
                {opt.icon}
              </button>
            ))}
          </div>

          <ul className="ctp__list">
            {rows.map((row, index) => (
              <li key={index} className="ctp__row">
                <div className="ctp__row-head">
                  <span className="ctp__row-num">버튼 {index + 1}</span>
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      className="ctp__row-remove"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        removeRow(index);
                      }}
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <input
                  ref={index === 0 ? firstLabelRef : undefined}
                  type="text"
                  className="ctp__input"
                  value={row.label}
                  onChange={(e) => updateRow(index, 'label', e.target.value)}
                  placeholder="버튼 문구 (예: 신청하기)"
                  maxLength={40}
                />
                <input
                  type="url"
                  className="ctp__input"
                  value={row.href}
                  onChange={(e) => updateRow(index, 'href', e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      apply();
                    }
                  }}
                />
              </li>
            ))}
          </ul>

          {rows.length < CTA_BUTTONS_MAX ? (
            <button
              type="button"
              className="ctp__add"
              onMouseDown={(e) => {
                e.preventDefault();
                addRow();
              }}
            >
              + 버튼 추가
            </button>
          ) : null}

          {hint ? <p className="ctp__hint ctp__hint--err">{hint}</p> : null}

          <div className="ctp__actions">
            <button
              type="button"
              className="ctp__btn ctp__btn--apply"
              onMouseDown={(e) => {
                e.preventDefault();
                apply();
              }}
            >
              {isActive ? '수정' : '삽입'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
