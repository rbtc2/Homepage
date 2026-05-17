'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ImageUploadOptimizePanel from './ImageUploadOptimizePanel';
import icons from './icons';

function normalizeImageUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|\/)/i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
}

/**
 * 본문 이미지 삽입 — 파일 업로드(최적화 단계) 또는 URL 입력.
 */
export default function ImagePicker({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [hint, setHint] = useState(null);
  const wrapRef = useRef(null);
  const fileRef = useRef(null);
  const urlRef = useRef(null);

  const insertImage = useCallback(
    (src) => {
      if (!src || !editor) return;
      editor.chain().focus().setEditorImage({ src }).run();
      setOpen(false);
      setUrl('');
      setHint(null);
      setPendingFile(null);
    },
    [editor]
  );

  const openPicker = useCallback(() => {
    setUrl('');
    setHint(null);
    setPendingFile(null);
    setOpen(true);
    setTimeout(() => urlRef.current?.focus(), 40);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setPendingFile(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (pendingFile) {
          setPendingFile(null);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [pendingFile]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setHint(null);
    setPendingFile(file);
  }, []);

  const applyUrl = useCallback(() => {
    const src = normalizeImageUrl(url);
    if (!src) return;
    insertImage(src);
  }, [url, insertImage]);

  const dialogClass = pendingFile ? 'ip ip--wide' : 'ip';

  return (
    <div className="ep-img-picker-wrap" ref={wrapRef}>
      <button
        type="button"
        title="이미지 삽입"
        aria-label="이미지 삽입"
        className="ep-toolbar__btn"
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) setOpen(false);
          else openPicker();
        }}
      >
        {icons.image}
      </button>

      {open && (
        <div className={dialogClass} role="dialog" aria-label="이미지 삽입">
          {pendingFile ? (
            <>
              <p className="ip__label">이미지 최적화</p>
              <ImageUploadOptimizePanel
                file={pendingFile}
                folder="editor-content"
                applyLabel="업로드 후 삽입"
                onSuccess={insertImage}
                onCancel={() => setPendingFile(null)}
              />
            </>
          ) : (
            <>
              <p className="ip__label">본문 이미지 삽입</p>

              <input
                ref={fileRef}
                type="file"
                className="ip__file-input"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                tabIndex={-1}
              />
              <button
                type="button"
                className="ip__upload-btn"
                onMouseDown={(e) => {
                  e.preventDefault();
                  fileRef.current?.click();
                }}
              >
                파일에서 선택
              </button>
              <p className="ip__meta">최대 5MB · JPG, PNG, WebP, GIF</p>

              <p className="ip__or">또는 URL</p>

              <div className="ip__input-row">
                <input
                  ref={urlRef}
                  type="url"
                  className="ip__input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyUrl();
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      setOpen(false);
                    }
                  }}
                />
              </div>

              {hint ? <p className="ip__hint ip__hint--err">{hint}</p> : null}

              <div className="ip__actions">
                <button
                  type="button"
                  className="ip__btn ip__btn--apply"
                  disabled={!url.trim()}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyUrl();
                  }}
                >
                  URL로 삽입
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
