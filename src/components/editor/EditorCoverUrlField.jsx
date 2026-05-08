'use client';

import { useCallback, useRef, useState } from 'react';
import { uploadEditorCoverImage } from '@/app/admin/upload-cover-image-action';

/**
 * 커버/썸네일 URL 입력 (`ep-cover` 레이아웃). 미리보기는 선택.
 * `uploadFolder`가 있으면 Supabase Storage 업로드 후 URL 필드를 채울 수 있습니다.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {string} [props.wrapperClassName] - `ep-cover`에 덧붙일 클래스
 * @param {boolean} [props.showPreview=true]
 * @param {'wr-news'|'gallery'} [props.uploadFolder] - 설정 시 PC에서 파일 업로드 허용
 */
export default function EditorCoverUrlField({
  label,
  value,
  onChange,
  placeholder = 'https://example.com/image.jpg',
  wrapperClassName = '',
  showPreview = true,
  uploadFolder,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadHint, setUploadHint] = useState(null);
  const rootClass = wrapperClassName ? `ep-cover ${wrapperClassName}` : 'ep-cover';
  const trimmed = value.trim();

  const handlePickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !uploadFolder) return;

      setUploadHint(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', uploadFolder);
        const res = await uploadEditorCoverImage(fd);
        if (res.ok) {
          onChange(res.url);
          setUploadHint('업로드되었습니다. 저장 시 반영됩니다.');
        } else {
          setUploadHint(res.message);
        }
      } catch {
        setUploadHint('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setUploading(false);
      }
    },
    [onChange, uploadFolder]
  );

  return (
    <div className={rootClass}>
      <span className="ep-cover__label">{label}</span>

      {uploadFolder ? (
        <div className="ep-cover__upload-row" aria-live="polite">
          <input
            ref={fileInputRef}
            type="file"
            className="ep-cover__file-input"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            tabIndex={-1}
          />
          <button
            type="button"
            className="ep-cover__upload-btn"
            onClick={handlePickFile}
            disabled={uploading}
          >
            {uploading ? '업로드 중…' : '이미지 파일 업로드'}
          </button>
          <span className="ep-cover__upload-meta">최대 5MB · JPG, PNG, WebP, GIF</span>
        </div>
      ) : null}

      {uploadHint ? (
        <p className={`ep-cover__hint ${uploadHint.includes('업로드되었') ? 'ep-cover__hint--ok' : 'ep-cover__hint--err'}`}>
          {uploadHint}
        </p>
      ) : null}

      <div className="ep-cover__row">
        <input
          type="url"
          className="ep-cover__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {showPreview ? (
          <div className="ep-cover__preview" aria-label="이미지 미리보기">
            {trimmed ? (
              // eslint-disable-next-line @next/next/no-img-element -- 외부 URL 동적 미리보기
              <img src={trimmed} alt="미리보기" />
            ) : (
              <div className="ep-cover__preview-empty" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3 17l5-4 3 3 3-2 7 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
