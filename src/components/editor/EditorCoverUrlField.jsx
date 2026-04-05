'use client';

/**
 * 커버/썸네일 URL 입력 (`ep-cover` 레이아웃). 미리보기는 선택.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {string} [props.wrapperClassName] - `ep-cover`에 덧붙일 클래스
 * @param {boolean} [props.showPreview=true]
 */
export default function EditorCoverUrlField({
  label,
  value,
  onChange,
  placeholder = 'https://example.com/image.jpg',
  wrapperClassName = '',
  showPreview = true,
}) {
  const rootClass = wrapperClassName ? `ep-cover ${wrapperClassName}` : 'ep-cover';
  const trimmed = value.trim();

  return (
    <div className={rootClass}>
      <span className="ep-cover__label">{label}</span>
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
