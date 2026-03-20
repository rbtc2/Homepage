'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';

import { createDisclosure, updateDisclosure } from './actions';

function ToolbarBtn({ active, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`ep-toolbar__btn${active ? ' ep-toolbar__btn--on' : ''}`}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="ep-toolbar__sep" aria-hidden="true" />;
}

const icons = {
  undo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h10a6 6 0 010 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 3L3 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  redo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 7H11a6 6 0 000 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bold: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  italic: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 4h-9M14 20H5M15 4L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  underline: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3v7a6 6 0 0012 0V3M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  strike: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.3 12a4.8 4.8 0 01.7 2.6C18 17.1 15.3 19 12 19s-6-1.9-6-4.4c0-.9.3-1.8.7-2.6M3 12h18M6.7 7C7.4 5.2 9.5 4 12 4c3.3 0 6 1.9 6 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bulletList: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  orderedList: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 6h11M10 12h11M10 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <text x="2" y="8" fontSize="7" fontWeight="700" fill="currentColor">
        1
      </text>
      <text x="2" y="14" fontSize="7" fontWeight="700" fill="currentColor">
        2
      </text>
      <text x="2" y="20" fontSize="7" fontWeight="700" fill="currentColor">
        3
      </text>
    </svg>
  ),
  blockquote: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  alignLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 10h10M4 14h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  alignCenter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 10h10M4 14h16M7 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  alignRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M10 10h10M4 14h16M10 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  hr: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  table: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  rowBefore: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 11v10M15 11v10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 7V3M10 5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  rowAfter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 3v10M15 3v10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 17v4M10 19h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  deleteRow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 7v10M15 7v10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 4.5l5 5M14.5 4.5l-5 5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  colBefore: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="11" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11 9h10M11 15h10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 12H3M5 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  colAfter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h10M3 15h10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M17 12h4M19 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  deleteCol: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 9h10M7 15h10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 9.5l5 5M9.5 9.5l-5 5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  mergeCells: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 3v9M12 15v6" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
      <path d="M8 10l4-4 4 4M8 14l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  splitCell: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 9l3 3-3 3M15 9l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  deleteTable: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

const TBL_ROWS = 7;
const TBL_COLS = 9;

function TableGridPicker({ onSelect, onClose }) {
  const ref = useRef(null);
  const [hover, setHover] = useState([0, 0]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const [hRow, hCol] = hover;

  return (
    <div className="tgp" ref={ref} role="dialog" aria-label="Table size picker">
      <p className="tgp__label">{hRow > 0 && hCol > 0 ? `${hCol} cols x ${hRow} rows` : 'Select table size'}</p>
      <div
        className="tgp__grid"
        style={{ gridTemplateColumns: `repeat(${TBL_COLS}, 1fr)` }}
        onMouseLeave={() => setHover([0, 0])}
      >
        {Array.from({ length: TBL_ROWS * TBL_COLS }, (_, i) => {
          const row = Math.floor(i / TBL_COLS) + 1;
          const col = (i % TBL_COLS) + 1;
          const isOn = row <= hRow && col <= hCol;
          return (
            <button
              key={i}
              type="button"
              className={`tgp__cell${isOn ? ' tgp__cell--on' : ''}`}
              onMouseEnter={() => setHover([row, col])}
              onClick={() => onSelect(row, col)}
              aria-label={`Insert ${col} cols x ${row} rows`}
            />
          );
        })}
      </div>
    </div>
  );
}

const MONTHS = ['1\uC6D4','2\uC6D4','3\uC6D4','4\uC6D4','5\uC6D4','6\uC6D4','7\uC6D4','8\uC6D4','9\uC6D4','10\uC6D4','11\uC6D4','12\uC6D4'];
const DAYS = ['\uC77C','\uC6D4','\uD654','\uC218','\uBAA9','\uAE08','\uD1B5'];

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function DatePicker({ value, onChange }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const initial = parseDate(value) ?? new Date();
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const selected = parseDate(value);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const firstDow = new Date(view.year, view.month, 1).getDay();
  const daysInMon = new Date(view.year, view.month + 1, 0).getDate();

  const prevYear = () => setView((v) => ({ ...v, year: v.year - 1 }));
  const nextYear = () => setView((v) => ({ ...v, year: v.year + 1 }));
  const prevMonth = () =>
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));
  const nextMonth = () =>
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));

  const handleSelect = (day) => {
    onChange(formatDate(view.year, view.month, day));
    setOpen(false);
  };

  const cells = Array(firstDow).fill(null).concat(Array.from({ length: daysInMon }, (_, i) => i + 1));

  return (
    <div className="dp" ref={ref}>
      <button
        type="button"
        className="dp__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="\uc791\uc131\uc77c\u0020\uc120\ud0dd"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {value ?? '\ub0a0\uc9dc\u0020\uc120\ud0dd'}
      </button>

      {open && (
        <div className="dp__panel" role="dialog" aria-label="\ub0a0\uc9dc\u0020\uc120\ud0dd">
          <div className="dp__hd">
            <button type="button" className="dp__nav" onClick={prevYear} title="\uc774\uc804\u0020\uc5f0\ub3c4">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 2L1 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="dp__nav" onClick={prevMonth} title="\uc774\uc804\u0020\ub2ec">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span className="dp__heading">
              {view.year}{'\ub144'} {MONTHS[view.month]}
            </span>

            <button type="button" className="dp__nav" onClick={nextMonth} title="\ub2e4\uc74c\u0020\ub2ec">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="dp__nav" onClick={nextYear} title="\ub2e4\uc74c\u0020\uc5f0\ub3c4">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="dp__grid">
            {DAYS.map((d) => (
              <span key={d} className="dp__dow">
                {d}
              </span>
            ))}

            {cells.map((day, i) => {
              if (!day) return <span key={`e${i}`} />;
              const cellDate = new Date(view.year, view.month, day);
              const isToday = cellDate.getTime() === todayDate.getTime();
              const isSelected = selected && cellDate.getTime() === selected.getTime();
              return (
                <button
                  key={day}
                  type="button"
                  className={[
                    'dp__day',
                    isToday ? 'dp__day--today' : '',
                    isSelected ? 'dp__day--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSelect(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="dp__footer">
            <button
              type="button"
              className="dp__today-btn"
              onClick={() => {
                const t = new Date();
                setView({ year: t.getFullYear(), month: t.getMonth() });
                onChange(formatDate(t.getFullYear(), t.getMonth(), t.getDate()));
                setOpen(false);
              }}
            >
              \uc624\ub298
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage({ disclosure }) {
  const router = useRouter();
  const isEdit = Boolean(disclosure);

  const [title, setTitle] = useState(disclosure?.title ?? '');
  const [createdAt, setCreatedAt] = useState(
    disclosure?.createdAt ?? new Date().toISOString().slice(0, 10),
  );
  const [saving, setSaving] = useState(false);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: '\ubcf8\ubb38\uc744\u0020\uc785\ub825\ud558\uc138\uc694\u002e\u002e\u002e',
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: disclosure?.content ?? '',
    editorProps: {
      attributes: {
        class: 'ep-content',
        spellCheck: 'false',
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert('\uc81c\ubaa9\uc744\u0020\uc785\ub825\ud574\u0020\uc8fc\uc138\uc694\u002e');
      return;
    }

    const content = editor?.getHTML() ?? '';
    if (!content || content === '<p></p>') {
      alert('\ub0b4\uc6a9\uc744\u0020\uc785\ub825\ud574\u0020\uc8fc\uc138\uc694\u002e');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateDisclosure(disclosure.id, { title, content, createdAt });
      } else {
        await createDisclosure({ title, content, createdAt });
      }
      router.push('/admin/disclosures');
      router.refresh();
    } catch {
      alert('\uc800\uc7a5\u0020\uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4\u002e\u0020\ub2e4\uc2dc\u0020\uc2dc\ub3c4\ud574\u0020\uc8fc\uc138\uc694\u002e');
    } finally {
      setSaving(false);
    }
  }, [title, createdAt, editor, isEdit, disclosure, router]);

  return (
    <div className="ep">
      <div className="ep__actionbar">
        <div className="ep__actionbar-inner">
          <Link href="/admin/disclosures" className="ep__back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 3L5 7L8.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            \ubaa9\ub85d\uc73c\ub85c
          </Link>
          <span className="ep__actionbar-title">{isEdit ? '\uacf5\uc2dc\uc790\ub8cc\u0020\uc218\uc815' : '\uc0c8\u0020\uacf5\uc2dc\uc790\ub8cc\u0020\uc791\uc131'}</span>
          <div className="ep__actionbar-btns">
            <Link href="/admin/disclosures" className="an-btn an-btn--secondary an-btn--sm">
              \ucde8\uc18c
            </Link>
            <button className="an-btn an-btn--primary an-btn--sm" onClick={handleSave} disabled={saving}>
              {saving ? '\uc800\uc7a5\u0020\uc911\u002e\u002e\u002e' : isEdit ? '\uc218\uc815\u0020\uc644\ub8cc' : '\uac8c\uc2dc\ud558\uae30'}
            </button>
          </div>
        </div>
      </div>

      <main className="ep__main">
        <div className="ep__paper">
          <div className="ep__meta-row">
            <div className="ep__meta-date">
              <span className="ep__meta-date-label">\uc791\uc131\uc77c</span>
              <DatePicker value={createdAt} onChange={setCreatedAt} />
            </div>
          </div>

          <input
            type="text"
            className="ep__title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="\uc81c\ubaa9\uc744\u0020\uc785\ub825\ud558\uc138\uc694"
            maxLength={100}
          />

          <div className="ep-toolbar" role="toolbar" aria-label="\ud14d\uc2a4\ud2b8\u0020\uc11c\uc2dd">
            <div className="ep-toolbar__group">
              <ToolbarBtn title="\uc2e4\ud589\u0020\ucde8\uc18c\u0020(\u0043\u0074\u0072\u006c\u002b\u005a)" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}>
                {icons.undo}
              </ToolbarBtn>
              <ToolbarBtn title="\ub2e4\uc2dc\u0020\uc2e4\ud589\u0020(\u0043\u0074\u0072\u006c\u002b\u0059)" disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}>
                {icons.redo}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn
                title="\ubcf8\ubb38"
                active={editor?.isActive('paragraph') && !editor?.isActive('heading')}
                onClick={() => editor?.chain().focus().setParagraph().run()}
              >
                <span className="ep-toolbar__label">\ubcf8\ubb38</span>
              </ToolbarBtn>
              <ToolbarBtn title="\uc81c\ubaa9\u0020\u0031" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <span className="ep-toolbar__label ep-toolbar__label--h1">H1</span>
              </ToolbarBtn>
              <ToolbarBtn title="\uc81c\ubaa9\u0020\u0032" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <span className="ep-toolbar__label">H2</span>
              </ToolbarBtn>
              <ToolbarBtn title="\uc81c\ubaa9\u0020\u0033" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                <span className="ep-toolbar__label">H3</span>
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="\uad75\uac8c\u0020(\u0043\u0074\u0072\u006c\u002b\u0042)" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
                {icons.bold}
              </ToolbarBtn>
              <ToolbarBtn title="\uae30\uc6b8\uc784\u0020(\u0043\u0074\u0072\u006c\u002b\u0049)" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                {icons.italic}
              </ToolbarBtn>
              <ToolbarBtn title="\ubc11\uc904\u0020(\u0043\u0074\u0072\u006c\u002b\u0055)" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                {icons.underline}
              </ToolbarBtn>
              <ToolbarBtn title="\ucde8\uc18c\uc120" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
                {icons.strike}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="\uae00\uba38\ub9ac\u0020uae30\ud638\u0020\ubaa9\ub85d" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                {icons.bulletList}
              </ToolbarBtn>
              <ToolbarBtn title="\ubc88\ud638\u0020\ub9e4\uae30\uae30\u0020\ubaa9\ub85d" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                {icons.orderedList}
              </ToolbarBtn>
              <ToolbarBtn title="\uc778\uc6a9\ucad6" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                {icons.blockquote}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="\uc67c\ucabd\u0020\uc815\ub82c" active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
                {icons.alignLeft}
              </ToolbarBtn>
              <ToolbarBtn title="\uac00\uc6b4\ub370\u0020\uc815\ub82c" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
                {icons.alignCenter}
              </ToolbarBtn>
              <ToolbarBtn title="\uc624\ub978\ucabd\u0020\uc815\ub82c" active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
                {icons.alignRight}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="\uad6c\ubd84\uc120" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                {icons.hr}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <div className="ep-tbl-wrap">
                <ToolbarBtn title="\ud45c\u0020\uc0bd\uc785" active={tablePickerOpen} onClick={() => setTablePickerOpen((o) => !o)}>
                  {icons.table}
                </ToolbarBtn>
                {tablePickerOpen && (
                  <TableGridPicker
                    onSelect={(rows, cols) => {
                      editor
                        ?.chain()
                        .focus()
                        .insertTable({ rows, cols, withHeaderRow: true })
                        .run();
                      setTablePickerOpen(false);
                    }}
                    onClose={() => setTablePickerOpen(false)}
                  />
                )}
              </div>
            </div>

            {editor?.isActive('table') && (
              <>
                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="\uc704\uc5d0\u0020\ud589\u0020\uc0bd\uc785" onClick={() => editor.chain().focus().addRowBefore().run()}>
                    {icons.rowBefore}
                  </ToolbarBtn>
                  <ToolbarBtn title="\uc544\ub798\uc5d0\u0020\ud589\u0020\uc0bd\uc785" onClick={() => editor.chain().focus().addRowAfter().run()}>
                    {icons.rowAfter}
                  </ToolbarBtn>
                  <ToolbarBtn title="\ud589\u0020\uc0ad\uc81c" onClick={() => editor.chain().focus().deleteRow().run()}>
                    {icons.deleteRow}
                  </ToolbarBtn>
                </div>

                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="\uc67c\ucabd\uc5d0\u0020\uc5f4\u0020\uc0bd\uc785" onClick={() => editor.chain().focus().addColumnBefore().run()}>
                    {icons.colBefore}
                  </ToolbarBtn>
                  <ToolbarBtn title="\uc624\ub978\ucabd\uc5d0\u0020\uc5f4\u0020\uc0bd\uc785" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                    {icons.colAfter}
                  </ToolbarBtn>
                  <ToolbarBtn title="\uc5f4\u0020\uc0ad\uc81c" onClick={() => editor.chain().focus().deleteColumn().run()}>
                    {icons.deleteCol}
                  </ToolbarBtn>
                </div>

                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="\uc140\u0020\ubcd1\ud569" disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()}>
                    {icons.mergeCells}
                  </ToolbarBtn>
                  <ToolbarBtn title="\uc140\u0020\ubd84\ub9ac" disabled={!editor.can().splitCell()} onClick={() => editor.chain().focus().splitCell().run()}>
                    {icons.splitCell}
                  </ToolbarBtn>
                </div>

                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="\ud45c\u0020\uc0ad\uc81c" onClick={() => editor.chain().focus().deleteTable().run()}>
                    {icons.deleteTable}
                  </ToolbarBtn>
                </div>
              </>
            )}
          </div>

          <EditorContent editor={editor} className="ep-editor-wrap" />
        </div>
      </main>
    </div>
  );
}

