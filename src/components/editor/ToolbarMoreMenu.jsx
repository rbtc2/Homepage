'use client';

import { useEffect, useRef, useState } from 'react';
import icons from './icons';
import { ToolbarBtn } from './ToolbarBtn';

function Item({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={`ecm__item${active ? ' ecm__item--on' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span className="ecm__icon">{icon}</span>
      {label}
    </button>
  );
}

export default function ToolbarMoreMenu({ editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const strikeOn = editor?.isActive('strike') ?? false;
  const subOn = editor?.isActive('subscript') ?? false;
  const supOn = editor?.isActive('superscript') ?? false;
  const quoteOn = editor?.isActive('blockquote') ?? false;
  const codeOn = editor?.isActive('codeBlock') ?? false;
  const anyOn = strikeOn || subOn || supOn || quoteOn || codeOn;

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

  const run = (cmd) => {
    if (!editor) return;
    cmd();
    setOpen(false);
  };

  return (
    <div className="ep-more-wrap" ref={ref}>
      <ToolbarBtn
        title="더보기"
        active={open || anyOn}
        onClick={() => setOpen((v) => !v)}
      >
        {icons.more}
      </ToolbarBtn>
      {open ? (
        <div className="ep-more" role="menu" aria-label="추가 서식">
          <p className="ecm__section">글자</p>
          <Item
            icon={icons.strike}
            label="취소선"
            active={strikeOn}
            onClick={() => run(() => editor.chain().focus().toggleStrike().run())}
          />
          <Item
            icon={icons.subscript}
            label="아래 첨자"
            active={subOn}
            onClick={() => run(() => editor.chain().focus().toggleSubscript().run())}
          />
          <Item
            icon={icons.superscript}
            label="위 첨자"
            active={supOn}
            onClick={() => run(() => editor.chain().focus().toggleSuperscript().run())}
          />
          <hr className="ecm__sep" />
          <p className="ecm__section">블록</p>
          <Item
            icon={icons.blockquote}
            label="인용구"
            active={quoteOn}
            onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())}
          />
          <Item
            icon={icons.codeBlock}
            label="코드 블록"
            active={codeOn}
            onClick={() => run(() => editor.chain().focus().toggleCodeBlock().run())}
          />
          <Item
            icon={icons.hr}
            label="구분선"
            onClick={() => run(() => editor.chain().focus().setHorizontalRule().run())}
          />
        </div>
      ) : null}
    </div>
  );
}
