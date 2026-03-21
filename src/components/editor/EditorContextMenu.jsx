'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── 인라인 SVG 아이콘 ──────────────────────────────────────── */
const I = {
  undo: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h10a6 6 0 010 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 3L3 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  redo: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 7H11a6 6 0 000 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bold: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  italic: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 4h-9M14 20H5M15 4L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  underline: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3v7a6 6 0 0012 0V3M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  strike: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.3 12a4.8 4.8 0 01.7 2.6C18 17.1 15.3 19 12 19s-6-1.9-6-4.4c0-.9.3-1.8.7-2.6M3 12h18M6.7 7C7.4 5.2 9.5 4 12 4c3.3 0 6 1.9 6 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  link: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  unlink: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  openLink: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rowBefore: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 11v10M15 11v10" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M12 7V3M10 5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  rowAfter: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 3v10M15 3v10" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M12 17v4M10 19h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  deleteRow: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 7v10M15 7v10" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9.5 4.5l5 5M14.5 4.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  colBefore: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="11" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M11 9h10M11 15h10" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7 12H3M5 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  colAfter: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M3 9h10M3 15h10" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M17 12h4M19 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  deleteCol: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M7 9h10M7 15h10" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4.5 9.5l5 5M9.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  mergeCells: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M3 12h18M12 3v9M12 15v6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 10l4-4 4 4M8 14l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  splitCell: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9 9l3 3-3 3M15 9l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  deleteTable: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

/* ─── 내부 컴포넌트 ─────────────────────────────────────────── */
function Item({ label, shortcut, icon, onClick, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      className={[
        'ecm__item',
        disabled ? 'ecm__item--disabled' : '',
        danger   ? 'ecm__item--danger'   : '',
      ].filter(Boolean).join(' ')}
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
      disabled={disabled}
    >
      {icon && <span className="ecm__icon" aria-hidden="true">{icon}</span>}
      <span className="ecm__label">{label}</span>
      {shortcut && <span className="ecm__shortcut">{shortcut}</span>}
    </button>
  );
}

function Sep() {
  return <hr className="ecm__sep" />;
}

function Section({ children }) {
  return <p className="ecm__section">{children}</p>;
}

/* ─── 메인 컨텍스트 메뉴 ────────────────────────────────────── */
export default function EditorContextMenu({ editor, pos, onClose }) {
  const [linkInput, setLinkInput] = useState(false);
  const [linkUrl,   setLinkUrl]   = useState('');
  const ref     = useRef(null);
  const linkRef = useRef(null);

  /* 화면 밖으로 나가지 않도록 위치 조정 (고정 위치이므로 뷰포트 기준) */
  const style = typeof window !== 'undefined'
    ? {
        left: Math.max(8, Math.min(pos.x, window.innerWidth  - 220)) + 'px',
        top:  Math.max(8, Math.min(pos.y, window.innerHeight - 460)) + 'px',
      }
    : { left: pos.x + 'px', top: pos.y + 'px' };

  /* 외부 클릭 시 닫기 */
  useEffect(() => {
    const down = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [onClose]);

  /* Escape 키 닫기 */
  useEffect(() => {
    const kd = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', kd);
    return () => document.removeEventListener('keydown', kd);
  }, [onClose]);

  /* 스크롤 시 닫기 */
  useEffect(() => {
    window.addEventListener('scroll', onClose, true);
    return () => window.removeEventListener('scroll', onClose, true);
  }, [onClose]);

  /* 링크 입력 패널 열릴 때 포커스 */
  useEffect(() => {
    if (linkInput) setTimeout(() => linkRef.current?.focus(), 30);
  }, [linkInput]);

  if (!editor) return null;

  const inTable    = editor.isActive('table');
  const onLink     = editor.isActive('link');
  const hasSelect  = !editor.state.selection.empty;
  const linkHref   = editor.getAttributes('link').href ?? '';
  const canMerge   = inTable && editor.can().mergeCells();
  const canSplit   = inTable && editor.can().splitCell();

  /* 실행 후 메뉴 닫기 헬퍼 */
  const run = (cmd) => { cmd(); onClose(); };

  /* 링크 적용 */
  const applyLink = () => {
    let url = linkUrl.trim();
    if (!url) return;
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) url = 'https://' + url;
    editor.chain().focus()
      .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
      .run();
    onClose();
  };

  const openLinkInput = () => {
    setLinkUrl(onLink ? linkHref : '');
    setLinkInput(true);
  };

  return (
    <div ref={ref} className="ecm" style={style} role="menu" aria-label="에디터 메뉴">

      {/* ── 실행 취소 / 다시 실행 ── */}
      <Item icon={I.undo} label="실행 취소" shortcut="Ctrl+Z"
        disabled={!editor.can().undo()}
        onClick={() => run(() => editor.chain().focus().undo().run())} />
      <Item icon={I.redo} label="다시 실행" shortcut="Ctrl+Y"
        disabled={!editor.can().redo()}
        onClick={() => run(() => editor.chain().focus().redo().run())} />

      <Sep />

      {/* ── 선택 영역 서식 (텍스트 선택 시만) ── */}
      {hasSelect && (
        <>
          <Section>서식</Section>
          <Item icon={I.bold}      label="굵게"   shortcut="Ctrl+B"
            onClick={() => run(() => editor.chain().focus().toggleBold().run())} />
          <Item icon={I.italic}    label="기울임" shortcut="Ctrl+I"
            onClick={() => run(() => editor.chain().focus().toggleItalic().run())} />
          <Item icon={I.underline} label="밑줄"   shortcut="Ctrl+U"
            onClick={() => run(() => editor.chain().focus().toggleUnderline().run())} />
          <Item icon={I.strike}    label="취소선"
            onClick={() => run(() => editor.chain().focus().toggleStrike().run())} />
          <Sep />
        </>
      )}

      {/* ── 링크 ── */}
      {onLink ? (
        <>
          <Section>링크</Section>
          <Item icon={I.openLink} label="새 탭에서 열기"
            onClick={() => { window.open(linkHref, '_blank', 'noopener,noreferrer'); onClose(); }} />
          <Item icon={I.link}   label="링크 편집"  onClick={openLinkInput} />
          <Item icon={I.unlink} label="링크 해제"
            onClick={() => run(() => editor.chain().focus().unsetLink().run())} />
        </>
      ) : (
        <Item icon={I.link} label="링크 삽입" onClick={openLinkInput} />
      )}

      {/* ── 링크 URL 입력 패널 ── */}
      {linkInput && (
        <div className="ecm__link-panel">
          <input
            ref={linkRef}
            type="url"
            className="ecm__link-input"
            value={linkUrl}
            placeholder="https://example.com"
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter')  { e.preventDefault(); applyLink(); }
              if (e.key === 'Escape') { e.preventDefault(); setLinkInput(false); }
            }}
          />
          <div className="ecm__link-row">
            <button type="button" className="ecm__link-cancel"
              onMouseDown={(e) => { e.preventDefault(); setLinkInput(false); }}>
              취소
            </button>
            <button type="button" className="ecm__link-apply"
              disabled={!linkUrl.trim()}
              onMouseDown={(e) => { e.preventDefault(); applyLink(); }}>
              적용
            </button>
          </div>
        </div>
      )}

      {/* ── 표 (셀 안에 있을 때만) ── */}
      {inTable && !linkInput && (
        <>
          <Sep />

          <Section>행</Section>
          <Item icon={I.rowBefore} label="위에 행 삽입"
            onClick={() => run(() => editor.chain().focus().addRowBefore().run())} />
          <Item icon={I.rowAfter}  label="아래에 행 삽입"
            onClick={() => run(() => editor.chain().focus().addRowAfter().run())} />
          <Item icon={I.deleteRow} label="행 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteRow().run())} />

          <Sep />

          <Section>열</Section>
          <Item icon={I.colBefore} label="왼쪽에 열 삽입"
            onClick={() => run(() => editor.chain().focus().addColumnBefore().run())} />
          <Item icon={I.colAfter}  label="오른쪽에 열 삽입"
            onClick={() => run(() => editor.chain().focus().addColumnAfter().run())} />
          <Item icon={I.deleteCol} label="열 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteColumn().run())} />

          <Sep />

          <Section>셀</Section>
          <Item icon={I.mergeCells} label="셀 병합" disabled={!canMerge}
            onClick={() => run(() => editor.chain().focus().mergeCells().run())} />
          <Item icon={I.splitCell}  label="셀 분리" disabled={!canSplit}
            onClick={() => run(() => editor.chain().focus().splitCell().run())} />

          <Sep />

          <Item icon={I.deleteTable} label="표 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteTable().run())} />
        </>
      )}
    </div>
  );
}
