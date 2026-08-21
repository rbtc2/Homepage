'use client';

const SHORTCUTS = [
  ['Ctrl + B', '굵게'],
  ['Ctrl + I', '기울임'],
  ['Ctrl + U', '밑줄'],
  ['Ctrl + Z', '실행 취소'],
  ['Ctrl + Shift + Z', '다시 실행'],
  ['Ctrl + F', '찾기'],
  ['Ctrl + H', '찾기/바꾸기'],
  ['Tab', '들여쓰기'],
  ['Shift + Tab', '내어쓰기'],
];

export default function ShortcutHelpModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="ep-modal" role="dialog" aria-modal="true" aria-label="단축키 안내">
      <button type="button" className="ep-modal__backdrop" aria-label="닫기" onClick={onClose} />
      <div className="ep-modal__panel">
        <div className="ep-modal__head">
          <h2 className="ep-modal__title">단축키</h2>
          <button type="button" className="ep-modal__close" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="ep-modal__body">
          <table className="ep-shortcut">
            <tbody>
              {SHORTCUTS.map(([keys, label]) => (
                <tr key={keys}>
                  <th>{keys}</th>
                  <td>{label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
