'use client';

/**
 * 에디터 메타 영역용 체크박스 (`an-check` 스타일)
 *
 * @param {object} props
 * @param {boolean} props.checked
 * @param {(checked: boolean) => void} props.onChange
 * @param {string} props.label
 */
export default function EditorCheckboxField({ checked, onChange, label }) {
  return (
    <label className="an-check">
      <input
        type="checkbox"
        className="an-check__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="an-check__box" aria-hidden="true">
        <svg className="an-check__mark" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 5l2.5 2.5L8.5 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="an-check__label">{label}</span>
    </label>
  );
}
