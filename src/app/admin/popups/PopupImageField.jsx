'use client';

import { useRef, useState, useCallback } from 'react';
import ImageUploadOptimizePanel from '@/components/editor/ImageUploadOptimizePanel';

export default function PopupImageField({ imageUrl, onImageUrlChange }) {
  const fileRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [hint, setHint] = useState(null);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setHint(null);
    setPendingFile(file);
  }, []);

  const handleUploadSuccess = useCallback(
    (url) => {
      onImageUrlChange(url);
      setPendingFile(null);
      setHint('업로드되었습니다.');
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
        disabled={Boolean(pendingFile)}
        tabIndex={-1}
      />

      {!pendingFile ? (
        <div className="an-popup-img__actions">
          <button
            type="button"
            className="an-btn an-btn--secondary an-btn--sm"
            onClick={() => fileRef.current?.click()}
          >
            이미지 파일 선택
          </button>
          <span className="an-popup-img__meta">최대 5MB · JPG, PNG, WebP, GIF</span>
        </div>
      ) : null}

      {pendingFile ? (
        <div className="an-popup-img__optimize">
          <ImageUploadOptimizePanel
            file={pendingFile}
            folder="popups"
            applyLabel="업로드 후 적용"
            onSuccess={handleUploadSuccess}
            onCancel={() => setPendingFile(null)}
          />
        </div>
      ) : null}

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
