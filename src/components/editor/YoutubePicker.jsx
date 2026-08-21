'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import icons from './icons';
import { parseYoutubeId } from './EditorYoutube';

export default function YoutubePicker({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  const isActive = editor?.isActive('editorYoutube') ?? false;

  const openPicker = useCallback(() => {
    setUrl('');
    setError('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 40);
  }, []);

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
    const id = parseYoutubeId(url);
    if (!id) {
      setError('유튜브 주소 또는 영상 ID를 확인해 주세요.');
      return;
    }
    const ok = editor?.chain().focus().setYoutubeVideo(url).run();
    if (!ok) {
      setError('영상을 넣지 못했습니다. 다시 시도해 주세요.');
      return;
    }
    setOpen(false);
    setUrl('');
    setError('');
  }, [editor, url]);

  return (
    <div className="ep-link-wrap" ref={ref}>
      <button
        type="button"
        title="유튜브 영상 삽입"
        aria-label="유튜브 영상 삽입"
        className={`ep-toolbar__btn${isActive || open ? ' ep-toolbar__btn--on' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) setOpen(false);
          else openPicker();
        }}
      >
        {icons.youtube}
      </button>

      {open ? (
        <div className="lp" role="dialog" aria-label="유튜브 영상 삽입">
          <p className="lp__label">유튜브 주소 삽입</p>
          <div className="lp__input-row">
            <input
              ref={inputRef}
              type="url"
              className="lp__input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://www.youtube.com/watch?v=…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  apply();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setOpen(false);
                }
              }}
            />
          </div>
          {error ? <p className="lp__error">{error}</p> : null}
          <div className="lp__actions">
            <button
              type="button"
              className="lp__btn lp__btn--apply"
              disabled={!url.trim()}
              onMouseDown={(e) => {
                e.preventDefault();
                apply();
              }}
            >
              삽입
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
