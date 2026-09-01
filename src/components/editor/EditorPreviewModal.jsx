'use client';

import SafeHtml from '@/components/board/SafeHtml';
import { parseCoverWidthPx } from '@/lib/cover-image-width';

export default function EditorPreviewModal({
  open,
  title,
  html,
  coverImage = '',
  coverWidth = '',
  onClose,
}) {
  if (!open) return null;

  const coverSrc = String(coverImage ?? '').trim();
  const sizedWidth = parseCoverWidthPx(coverWidth);

  return (
    <div className="ep-modal" role="dialog" aria-modal="true" aria-label="게시 미리보기">
      <button type="button" className="ep-modal__backdrop" aria-label="닫기" onClick={onClose} />
      <div className="ep-modal__panel ep-modal__panel--wide">
        <div className="ep-modal__head">
          <h2 className="ep-modal__title">게시 미리보기</h2>
          <button type="button" className="ep-modal__close" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="ep-modal__body">
          <h1 className="ep-preview__title">{title.trim() || '(제목 없음)'}</h1>
          {coverSrc ? (
            <div
              className={
                sizedWidth ? 'ep-preview__cover ep-preview__cover--sized' : 'ep-preview__cover'
              }
              style={sizedWidth ? { '--ep-preview-cover-w': `${sizedWidth}px` } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 미리보기 동적 URL */}
              <img src={coverSrc} alt="" className="ep-preview__cover-img" />
            </div>
          ) : null}
          <SafeHtml html={html} className="nd__body nd__body--html" />
        </div>
      </div>
    </div>
  );
}
