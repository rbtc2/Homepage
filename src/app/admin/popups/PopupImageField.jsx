'use client';

import { useRef, useState, useCallback } from 'react';
import { uploadEditorCoverImage } from '@/app/admin/upload-cover-image-action';

export default function PopupImageField({ imageUrl, onImageUrlChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [hint, setHint] = useState(null);

  const handleFile = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;

      setHint(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'popups');
        const res = await uploadEditorCoverImage(fd);
        if (res.ok) {
          onImageUrlChange(res.url);
          setHint('업로드되었습니다.');
        } else {
          setHint(res.message);
        }
      } catch {
        setHint('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setUploading(false);
      }
    },
    [onImageUrlChange]
  );

  return (
    <div className="an-field">
      <span className="an-field__label">
        팝업 이미지 <span className="an-field__req" aria-hidden="true">*</span>
      </span>

      <input
        ref={fileRef}
        type="file"
        className="an-popup-img__file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        disabled={uploading}
        tabIndex={-1}
      />
      <div className="an-popup-img__actions">
        <button
          type="button"
          className="an-btn an-btn--secondary an-btn--sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? '업로드 중…' : '이미지 파일 업로드'}
        </button>
        <span className="an-popup-img__meta">최대 5MB · JPG, PNG, WebP, GIF</span>
      </div>

      <input
        id="popup-image"
        name="imageUrl"
        type="url"
        className="an-field__input"
        placeholder="또는 이미지 URL을 직접 입력"
        value={imageUrl}
        onChange={(e) => onImageUrlChange(e.target.value)}
        required
      />

      {hint ? (
        <p
          className={`an-popup-img__hint${hint.includes('업로드되었') ? ' an-popup-img__hint--ok' : ' an-popup-img__hint--err'}`}
          aria-live="polite"
        >
          {hint}
        </p>
      ) : null}

      {imageUrl ? (
        <div className="an-popup-img__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" />
        </div>
      ) : null}
    </div>
  );
}
