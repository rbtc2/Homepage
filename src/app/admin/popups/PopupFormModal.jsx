'use client';

const POSITION_OPTIONS = [
  { value: 'center',       label: '중앙' },
  { value: 'bottom-left',  label: '좌하단' },
  { value: 'bottom-right', label: '우하단' },
];

const CLOSE_SVG = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CHECK_SVG = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 팝업 등록·수정 폼 모달.
 * @param {object|null} editTarget - 수정 대상 팝업 (null이면 신규)
 * @param {object}      form       - 현재 폼 상태
 * @param {function}    onChange   - 필드 변경 핸들러
 * @param {function}    onSubmit   - 폼 제출 핸들러
 * @param {function}    onClose    - 모달 닫기 핸들러
 */
export default function PopupFormModal({ editTarget, form, onChange, onSubmit, onClose }) {
  return (
    <div className="an-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="an-modal an-modal--popup-form" role="dialog" aria-modal="true">
        <div className="an-modal__hd">
          <h2 className="an-modal__title">
            {editTarget ? '팝업 수정' : '새 팝업 등록'}
          </h2>
          <button className="an-modal__close" onClick={onClose} aria-label="닫기">
            {CLOSE_SVG}
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="an-modal__body">
            <div className="an-field">
              <label className="an-field__label" htmlFor="popup-title">
                팝업 제목 <span className="an-field__req" aria-hidden="true">*</span>
              </label>
              <input
                id="popup-title" name="title" type="text"
                className="an-field__input"
                placeholder="관리용 제목을 입력하세요 (사용자에게 노출되지 않음)"
                value={form.title} onChange={onChange} required
              />
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="popup-image">이미지 URL</label>
              <input
                id="popup-image" name="imageUrl" type="url"
                className="an-field__input"
                placeholder="https://example.com/image.png"
                value={form.imageUrl} onChange={onChange}
              />
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="popup-link">클릭 시 이동 URL</label>
              <input
                id="popup-link" name="linkUrl" type="text"
                className="an-field__input"
                placeholder="/notices/1 또는 https://..."
                value={form.linkUrl} onChange={onChange}
              />
            </div>

            <div className="an-field-row">
              <div className="an-field">
                <label className="an-field__label" htmlFor="popup-start">
                  노출 시작일 <span className="an-field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="popup-start" name="startDate" type="date"
                  className="an-field__input"
                  value={form.startDate} onChange={onChange} required
                />
              </div>
              <div className="an-field">
                <label className="an-field__label" htmlFor="popup-end">
                  노출 종료일 <span className="an-field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="popup-end" name="endDate" type="date"
                  className="an-field__input"
                  value={form.endDate} onChange={onChange} required
                />
              </div>
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="popup-position">팝업 위치</label>
              <select
                id="popup-position" name="position"
                className="an-field__input an-field__select"
                value={form.position} onChange={onChange}
              >
                {POSITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="an-field-checks">
              <label className="an-check">
                <input type="checkbox" name="showCloseForDay" className="an-check__input"
                  checked={form.showCloseForDay} onChange={onChange} />
                <span className="an-check__box" aria-hidden="true">{CHECK_SVG}</span>
                <span className="an-check__label">오늘 하루 보지 않기 버튼 표시</span>
              </label>
              <label className="an-check">
                <input type="checkbox" name="isActive" className="an-check__input"
                  checked={form.isActive} onChange={onChange} />
                <span className="an-check__box" aria-hidden="true">{CHECK_SVG}</span>
                <span className="an-check__label">즉시 활성화</span>
              </label>
            </div>
          </div>

          <div className="an-modal__ft">
            <button type="button" className="an-btn an-btn--secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="an-btn an-btn--primary">
              {editTarget ? '수정 저장' : '팝업 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
