'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getAttachmentFileExtension,
  resolveAttachmentDisplayName,
} from '@/lib/attachment-display-name';
import { uploadEditorAttachmentFile } from '@/lib/upload-editor-attachment-client';
import icons from './icons';

const ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.hwp,.hwpx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-zip-compressed';

function normalizeFileUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|\/)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function fileNameFromUrl(href) {
  try {
    const segment = new URL(href).pathname.split('/').pop();
    return segment ? decodeURIComponent(segment) : '';
  } catch {
    const segment = href.split('/').pop()?.split('?')[0];
    return segment ? decodeURIComponent(segment) : '';
  }
}

/**
 * 본문 첨부파일 삽입 — 파일 업로드 또는 URL 입력.
 */
export default function AttachmentPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hint, setHint] = useState(null);
  const wrapRef = useRef(null);
  const fileRef = useRef(null);
  const urlRef = useRef(null);
  const nameInputRef = useRef(null);
  const fileNameRef = useRef('');

  fileNameRef.current = fileName;

  const insertAttachment = useCallback(
    (href, name) => {
      if (!href || !editor) return;
      editor
        .chain()
        .focus()
        .setEditorAttachment({
          href,
          fileName: name?.trim() || '첨부파일',
        })
        .run();
      setOpen(false);
      setUrl('');
      setFileName('');
      setHint(null);
    },
    [editor]
  );

  const openPicker = useCallback(() => {
    setUrl('');
    setFileName('');
    setHint(null);
    setOpen(true);
    setTimeout(() => nameInputRef.current?.focus(), 40);
  }, []);

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

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || uploading) return;

      setHint(null);
      setUploading(true);
      try {
        const displayName = fileNameRef.current.trim();
        const result = await uploadEditorAttachmentFile(file, displayName);
        if (!result.ok) {
          setHint(result.message);
          return;
        }
        insertAttachment(result.url, result.fileName);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        setHint(msg ? `업로드 오류: ${msg}` : '업로드에 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setUploading(false);
      }
    },
    [uploading, insertAttachment]
  );

  const applyUrl = useCallback(() => {
    const href = normalizeFileUrl(url);
    if (!href) return;
    const fallbackName = fileNameFromUrl(href) || '첨부파일';
    const resolved = resolveAttachmentDisplayName(
      fileName,
      fallbackName,
      getAttachmentFileExtension(fallbackName) || getAttachmentFileExtension(href)
    );
    insertAttachment(href, resolved);
  }, [url, fileName, insertAttachment]);

  return (
    <div className="ep-attach-picker-wrap" ref={wrapRef}>
      <input
        ref={fileRef}
        type="file"
        className="ip__file-input"
        accept={ACCEPT}
        onChange={handleFileChange}
        disabled={uploading}
        tabIndex={-1}
      />

      <button
        type="button"
        title="첨부파일 삽입"
        aria-label="첨부파일 삽입"
        className="ep-toolbar__btn"
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) setOpen(false);
          else openPicker();
        }}
      >
        {icons.attachment}
      </button>

      {open ? (
        <div className="ip" role="dialog" aria-label="첨부파일 삽입">
          <p className="ip__label">첨부파일 삽입</p>

          <div className="ip__input-row">
            <input
              ref={nameInputRef}
              type="text"
              className="ip__input"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="표시할 파일명 (선택, 업로드·URL 공통)"
              maxLength={200}
              disabled={uploading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <button
            type="button"
            className="ip__upload-btn"
            disabled={uploading}
            onMouseDown={(e) => {
              e.preventDefault();
              fileRef.current?.click();
            }}
          >
            {uploading ? '업로드 중…' : '파일에서 선택'}
          </button>
          <p className="ip__meta">최대 20MB · PDF, Word, Excel, PPT, ZIP, HWP</p>

          <p className="ip__or">또는 URL</p>

          <div className="ip__input-row">
            <input
              ref={urlRef}
              type="url"
              className="ip__input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/file.pdf"
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
      ) : null}
    </div>
  );
}
