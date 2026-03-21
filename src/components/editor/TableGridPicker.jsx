'use client';

import { useState, useEffect, useRef } from 'react';

const TBL_ROWS = 7;
const TBL_COLS = 9;

export default function TableGridPicker({ onSelect, onClose }) {
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
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const [hRow, hCol] = hover;
  return (
    <div className="tgp" ref={ref} role="dialog" aria-label="표 크기 선택">
      <p className="tgp__label">
        {hRow > 0 && hCol > 0 ? `${hCol}열 x ${hRow}행` : '표 크기를 선택하세요'}
      </p>
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
              aria-label={`${col}열 ${row}행 표 삽입`}
            />
          );
        })}
      </div>
    </div>
  );
}
