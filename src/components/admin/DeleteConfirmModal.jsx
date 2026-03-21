'use client';

/**
 * 게시물 삭제 확인 모달.
 * @param {{ id, title }} target  - 삭제 대상 게시물 (null이면 렌더링 안 함)
 * @param {() => void}   onClose  - 모달 닫기 콜백
 * @param {() => void}   onConfirm - 삭제 확인 콜백
 * @param {boolean}      deleting  - 삭제 진행 중 여부
 */
export default function DeleteConfirmModal({ target, onClose, onConfirm, deleting }) {
  if (!target) return null;

  return (
    <div
      className="an-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="an-modal an-modal--sm"
        role="dialog"
        aria-modal="true"
        aria-label="게시물 삭제 확인"
      >
        <div className="an-modal__hd">
          <h2 className="an-modal__title">게시물 삭제</h2>
          <button className="an-modal__close" onClick={onClose} aria-label="닫기">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="an-modal__body">
          <div className="an-del-confirm">
            <div className="an-del-confirm__icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                />
                <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="an-del-confirm__q">이 게시물을 삭제하시겠습니까?</p>
            <p className="an-del-confirm__title">&ldquo;{target.title}&rdquo;</p>
            <p className="an-del-confirm__warn">삭제된 게시물은 복구할 수 없습니다.</p>
          </div>
        </div>

        <div className="an-modal__ft">
          <button className="an-btn an-btn--secondary" onClick={onClose}>
            취소
          </button>
          <button className="an-btn an-btn--danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
