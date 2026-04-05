'use client';

import DatePicker from './DatePicker';

/**
 * 메타 행의 날짜 필드 (라벨 + DatePicker)
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 */
export default function EditorMetaDate({ label, value, onChange }) {
  return (
    <div className="ep__meta-date">
      <span className="ep__meta-date-label">{label}</span>
      <DatePicker value={value} onChange={onChange} />
    </div>
  );
}
