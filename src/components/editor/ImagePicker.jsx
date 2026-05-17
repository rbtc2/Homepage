'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { uploadEditorCoverImage } from '@/app/admin/upload-cover-image-action';
import icons from './icons';

function normalizeImageUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|\/)/i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
}

/**
 * 본문 이미지 삽입 — 파일 업로드 또는 URL 입력.
 */
export default function ImagePicker({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
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
    },
    [editor]
  );

  const openPicker = useCallback(() => {
    setUrl('');
    setHint(null);
    setOpen(true);
    setTimeout(() => urlRef.current?.focus(), 40);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
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

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;

      setHint(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'editor-content');
        const res = await uploadEditorCoverImage(fd);
        if (res.ok) {
          insertImage(res.url);
        } else {
          setHint(res.message);
        }
      } catch {
        setHint('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setUploading(false);
      }
    },
    [insertImage]
  );

  const applyUrl = useCallback(() => {
    const src = normalizeImageUrl(url);
    if (!src) return;
    insertImage(src);
  }, [url, insertImage]);

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
        <div className="ip" role="dialog" aria-label="이미지 삽입">
          <p className="ip__label">본문 이미지 삽입</p>

          <input
            ref={fileRef}
            type="file"
            className="ip__file-input"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            tabIndex={-1}
          />
          <button
            type="button"
            className="ip__upload-btn"
            disabled={uploading}
            onMouseDown={(e) => {
              e.preventDefault();
              fileRef.current?.click();
            }}
          >
            {uploading ? '업로드 중…' : '파일에서 업로드'}
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
              disabled={uploading}
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
              disabled={!url.trim() || uploading}
              onMouseDown={(e) => {
                e.preventDefault();
                applyUrl();
              }}
            >
              URL로 삽입
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
