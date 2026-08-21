'use client';

import SafeHtml from '@/components/board/SafeHtml';

export default function EditorPreviewModal({ open, title, html, onClose }) {
  if (!open) return null;

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
          <SafeHtml html={html} className="nd__body nd__body--html" />
        </div>
      </div>
    </div>
  );
}
