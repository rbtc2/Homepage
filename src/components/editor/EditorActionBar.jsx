'use client';

import Link from 'next/link';

function BackChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M8.5 3L5 7L8.5 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 에디터 페이지 상단 액션 바 (목록으로 / 제목 / 취소·저장)
 *
 * @param {object} props
 * @param {string} props.backHref
 * @param {string} props.pageTitle - 현재 모드 제목 문구 (`isEdit ? editTitle : newTitle`)
 * @param {boolean} props.saving
 * @param {() => void} props.onSave
 * @param {string} props.primaryLabel - 저장 버튼 문구 (예: 게시하기 / 등록하기 / 수정 완료)
 */
export default function EditorActionBar({ backHref, pageTitle, saving, onSave, primaryLabel }) {
  return (
    <div className="ep__actionbar">
      <div className="ep__actionbar-inner">
        <Link href={backHref} className="ep__back">
          <BackChevron />
          목록으로
        </Link>
        <span className="ep__actionbar-title">{pageTitle}</span>
        <div className="ep__actionbar-btns">
          <Link href={backHref} className="an-btn an-btn--secondary an-btn--sm">
            취소
          </Link>
          <button
            type="button"
            className="an-btn an-btn--primary an-btn--sm"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
