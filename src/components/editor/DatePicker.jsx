'use client';

import { useState, useEffect, useRef } from 'react';

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DAYS   = ['일','월','화','수','목','금','토'];

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function DatePicker({ value, onChange }) {
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
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const selected  = parseDate(value);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const firstDow  = new Date(view.year, view.month, 1).getDay();
  const daysInMon = new Date(view.year, view.month + 1, 0).getDate();

  const prevYear  = () => setView((v) => ({ ...v, year: v.year - 1 }));
  const nextYear  = () => setView((v) => ({ ...v, year: v.year + 1 }));
  const prevMonth = () => setView((v) =>
    v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }
  );
  const nextMonth = () => setView((v) =>
    v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }
  );

  const handleSelect = (day) => {
    onChange(formatDate(view.year, view.month, day));
    setOpen(false);
  };

  const cells = Array(firstDow).fill(null).concat(
    Array.from({ length: daysInMon }, (_, i) => i + 1)
  );

  return (
    <div className="dp" ref={ref}>
      <button
        type="button"
        className="dp__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="작성일 선택"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        {value ?? '날짜 선택'}
      </button>

      {open && (
        <div className="dp__panel" role="dialog" aria-label="날짜 선택">
          <div className="dp__hd">
            <button type="button" className="dp__nav" onClick={prevYear} title="이전 연도">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 2L1 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" className="dp__nav" onClick={prevMonth} title="이전 달">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="dp__heading">{view.year}년 {MONTHS[view.month]}</span>
            <button type="button" className="dp__nav" onClick={nextMonth} title="다음 달">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" className="dp__nav" onClick={nextYear} title="다음 연도">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="dp__grid">
            {DAYS.map((d) => (
              <span key={d} className="dp__dow">{d}</span>
            ))}
            {cells.map((day, i) => {
              if (!day) return <span key={`e${i}`} />;
              const cellDate  = new Date(view.year, view.month, day);
              const isToday    = cellDate.getTime() === todayDate.getTime();
              const isSelected = selected && cellDate.getTime() === selected.getTime();
              return (
                <button
                  key={day}
                  type="button"
                  className={[
                    'dp__day',
                    isToday    ? 'dp__day--today'    : '',
                    isSelected ? 'dp__day--selected' : '',
                  ].filter(Boolean).join(' ')}
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
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
