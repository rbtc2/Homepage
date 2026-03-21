'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import icons from './icons';

function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
}

export default function LinkPicker({ editor }) {
  const [open, setOpen]   = useState(false);
  const [url, setUrl]     = useState('');
  const ref               = useRef(null);
  const inputRef          = useRef(null);

  const isActive   = editor?.isActive('link') ?? false;
  const currentUrl = editor?.getAttributes('link')?.href ?? '';

  const openPicker = useCallback(() => {
    setUrl(currentUrl);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 40);
  }, [currentUrl]);

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

  const apply = useCallback(() => {
    const href = normalizeUrl(url);
    if (!href) return;
    editor?.chain().focus().setLink({ href, target: '_blank', rel: 'noopener noreferrer' }).run();
    setOpen(false);
    setUrl('');
  }, [editor, url]);

  const remove = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
    setOpen(false);
    setUrl('');
  }, [editor]);

  return (
    <div className="ep-link-wrap" ref={ref}>
      <button
        type="button"
        title={isActive ? '링크 편집' : '링크 삽입'}
        aria-label={isActive ? '링크 편집' : '링크 삽입'}
        className={`ep-toolbar__btn${isActive ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) setOpen(false);
          else openPicker();
        }}
      >
        {icons.link}
      </button>

      {open && (
        <div className="lp" role="dialog" aria-label="링크 설정">
          <p className="lp__label">URL 링크 삽입</p>

          <div className="lp__input-row">
            <input
              ref={inputRef}
              type="url"
              className="lp__input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); apply(); }
                if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
              }}
            />
          </div>

          <div className="lp__actions">
            {isActive && (
              <button
                type="button"
                className="lp__btn lp__btn--remove"
                onMouseDown={(e) => { e.preventDefault(); remove(); }}
              >
                {icons.unlink}
                링크 해제
              </button>
            )}
            <button
              type="button"
              className="lp__btn lp__btn--apply"
              disabled={!url.trim()}
              onMouseDown={(e) => { e.preventDefault(); apply(); }}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
