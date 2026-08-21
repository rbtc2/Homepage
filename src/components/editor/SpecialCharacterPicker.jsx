'use client';

import { useEffect, useRef, useState } from 'react';
import icons from './icons';
import { ToolbarBtn } from './ToolbarBtn';

const GROUPS = [
  {
    label: '공문',
    chars: ['※', '·', '•', '○', '●', '□', '■', '△', '▲', '→', '←', '↔', '☆', '★', '☞'],
  },
  {
    label: '번호',
    chars: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑴', '⑵', '⑶', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'],
  },
  {
    label: '단위',
    chars: ['㎡', '㎥', '℃', '℉', '㎜', '㎝', '㎞', '㎏', '±', '×', '÷', '≠', '≤', '≥', '∞'],
  },
  {
    label: '인용',
    chars: ['‘', '’', '“', '”', '「', '」', '『', '』', '…', '—', '–', '〃'],
  },
];

export default function SpecialCharacterPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  const insert = (ch) => {
    editor?.chain().focus().insertContent(ch).run();
  };

  return (
    <div className="ep-char-wrap" ref={ref}>
      <ToolbarBtn title="특수문자" active={open} onClick={() => setOpen((v) => !v)}>
        {icons.specialChar}
      </ToolbarBtn>
      {open ? (
        <div className="ep-char" role="dialog" aria-label="특수문자">
          {GROUPS.map((group) => (
            <div key={group.label} className="ep-char__group">
              <p className="ep-char__label">{group.label}</p>
              <div className="ep-char__grid">
                {group.chars.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    className="ep-char__btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insert(ch);
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
