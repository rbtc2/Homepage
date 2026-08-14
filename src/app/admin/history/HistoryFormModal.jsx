'use client';

const CLOSE_SVG = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function HistoryFormModal({
  editTarget,
  form,
  onChange,
  onSubmit,
  onClose,
  saving,
}) {
  return (
    <div className="an-overlay" onClick={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <div className="an-modal an-modal--sm" role="dialog" aria-modal="true">
        <div className="an-modal__hd">
          <h2 className="an-modal__title">{editTarget ? '연혁 수정' : '연혁 추가'}</h2>
          <button
            type="button"
            className="an-modal__close"
            onClick={onClose}
            aria-label="닫기"
            disabled={saving}
          >
            {CLOSE_SVG}
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="an-modal__body">
            <div className="an-field-row">
              <div className="an-field">
                <label className="an-field__label" htmlFor="history-year">
                  연도 <span className="an-field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="history-year"
                  name="year"
                  type="number"
                  min={1900}
                  max={2100}
                  className="an-field__input"
                  value={form.year}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="an-field">
                <label className="an-field__label" htmlFor="history-month">
                  월 <span className="an-field__req" aria-hidden="true">*</span>
                </label>
                <select
                  id="history-month"
                  name="month"
                  className="an-field__input an-field__select"
                  value={form.month}
                  onChange={onChange}
                  required
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="history-title">
                내용 <span className="an-field__req" aria-hidden="true">*</span>
              </label>
              <input
                id="history-title"
                name="title"
                type="text"
                className="an-field__input"
                placeholder="예: 창립총회 개회"
                value={form.title}
                onChange={onChange}
                maxLength={200}
                required
              />
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="history-detail">
                부가 설명
              </label>
              <textarea
                id="history-detail"
                name="detail"
                className="an-field__textarea"
                placeholder="필요하면 한 줄 설명을 적어 주세요. (선택)"
                value={form.detail}
                onChange={onChange}
                maxLength={1000}
                rows={3}
              />
            </div>
          </div>

          <div className="an-modal__ft">
            <button type="button" className="an-btn an-btn--secondary" onClick={onClose} disabled={saving}>
              취소
            </button>
            <button type="submit" className="an-btn an-btn--primary" disabled={saving}>
              {saving ? '저장 중…' : editTarget ? '수정 저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
