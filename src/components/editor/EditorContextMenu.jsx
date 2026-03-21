'use client';

import { useState, useEffect, useRef } from 'react';
import icons from './icons';

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
      <Item icon={icons.undo} label="실행 취소" shortcut="Ctrl+Z"
        disabled={!editor.can().undo()}
        onClick={() => run(() => editor.chain().focus().undo().run())} />
      <Item icon={icons.redo} label="다시 실행" shortcut="Ctrl+Y"
        disabled={!editor.can().redo()}
        onClick={() => run(() => editor.chain().focus().redo().run())} />

      <Sep />

      {/* ── 선택 영역 서식 (텍스트 선택 시만) ── */}
      {hasSelect && (
        <>
          <Section>서식</Section>
          <Item icon={icons.bold}      label="굵게"   shortcut="Ctrl+B"
            onClick={() => run(() => editor.chain().focus().toggleBold().run())} />
          <Item icon={icons.italic}    label="기울임" shortcut="Ctrl+I"
            onClick={() => run(() => editor.chain().focus().toggleItalic().run())} />
          <Item icon={icons.underline} label="밑줄"   shortcut="Ctrl+U"
            onClick={() => run(() => editor.chain().focus().toggleUnderline().run())} />
          <Item icon={icons.strike}    label="취소선"
            onClick={() => run(() => editor.chain().focus().toggleStrike().run())} />
          <Sep />
        </>
      )}

      {/* ── 링크 ── */}
      {onLink ? (
        <>
          <Section>링크</Section>
          <Item icon={icons.openLink} label="새 탭에서 열기"
            onClick={() => { window.open(linkHref, '_blank', 'noopener,noreferrer'); onClose(); }} />
          <Item icon={icons.link}   label="링크 편집"  onClick={openLinkInput} />
          <Item icon={icons.unlink} label="링크 해제"
            onClick={() => run(() => editor.chain().focus().unsetLink().run())} />
        </>
      ) : (
        <Item icon={icons.link} label="링크 삽입" onClick={openLinkInput} />
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
          <Item icon={icons.rowBefore} label="위에 행 삽입"
            onClick={() => run(() => editor.chain().focus().addRowBefore().run())} />
          <Item icon={icons.rowAfter}  label="아래에 행 삽입"
            onClick={() => run(() => editor.chain().focus().addRowAfter().run())} />
          <Item icon={icons.deleteRow} label="행 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteRow().run())} />

          <Sep />

          <Section>열</Section>
          <Item icon={icons.colBefore} label="왼쪽에 열 삽입"
            onClick={() => run(() => editor.chain().focus().addColumnBefore().run())} />
          <Item icon={icons.colAfter}  label="오른쪽에 열 삽입"
            onClick={() => run(() => editor.chain().focus().addColumnAfter().run())} />
          <Item icon={icons.deleteCol} label="열 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteColumn().run())} />

          <Sep />

          <Section>셀</Section>
          <Item icon={icons.mergeCells} label="셀 병합" disabled={!canMerge}
            onClick={() => run(() => editor.chain().focus().mergeCells().run())} />
          <Item icon={icons.splitCell}  label="셀 분리" disabled={!canSplit}
            onClick={() => run(() => editor.chain().focus().splitCell().run())} />

          <Sep />

          <Item icon={icons.deleteTable} label="표 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteTable().run())} />
        </>
      )}
    </div>
  );
}
