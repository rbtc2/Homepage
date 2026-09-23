'use client';

import { useState, useEffect, useRef } from 'react';
import { CTA_BUTTONS_MAX, normalizeCtaButtons } from './EditorCtaButtons';
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

function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function loadCtaRows(editor) {
  const attrs = editor.getAttributes('editorCtaButtons');
  const existing = normalizeCtaButtons(attrs.buttons);
  if (existing.length === 0) {
    return [{ label: '', href: '' }];
  }
  return existing.map((b) => ({ label: b.label, href: b.href }));
}

function loadCtaAlign(editor) {
  const align = editor.getAttributes('editorCtaButtons').align;
  return align === 'left' || align === 'right' ? align : 'center';
}

/* ─── 메인 컨텍스트 메뉴 ────────────────────────────────────── */
export default function EditorContextMenu({ editor, pos, onClose, ctaButtonIndex }) {
  const onCtaAtOpen = editor?.isActive('editorCtaButtons') ?? false;
  const [linkInput, setLinkInput] = useState(false);
  const [linkUrl,   setLinkUrl]   = useState('');
  const [ctaEdit, setCtaEdit] = useState(onCtaAtOpen);
  const [ctaRows, setCtaRows] = useState(() =>
    onCtaAtOpen && editor ? loadCtaRows(editor) : [{ label: '', href: '' }]
  );
  const [ctaAlign, setCtaAlign] = useState(() =>
    onCtaAtOpen && editor ? loadCtaAlign(editor) : 'center'
  );
  const [ctaHint, setCtaHint] = useState(null);
  const ref     = useRef(null);
  const linkRef = useRef(null);
  const ctaFocusRef = useRef(null);

  /* 화면 밖으로 나가지 않도록 위치 조정 (고정 위치이므로 뷰포트 기준) */
  const style = typeof window !== 'undefined'
    ? {
        left: Math.max(8, Math.min(pos.x, window.innerWidth  - (ctaEdit ? 320 : 220))) + 'px',
        top:  Math.max(8, Math.min(pos.y, window.innerHeight - (ctaEdit ? 520 : 620))) + 'px',
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

  useEffect(() => {
    if (!ctaEdit) return;
    setTimeout(() => ctaFocusRef.current?.focus(), 40);
  }, [ctaEdit]);

  if (!editor) return null;

  const inTable    = editor.isActive('table');
  const onImage    = editor.isActive('editorImage');
  const onYoutube  = editor.isActive('editorYoutube');
  const onCta      = editor.isActive('editorCtaButtons');
  const onLink     = editor.isActive('link');
  const hasSelect  = !editor.state.selection.empty;
  const linkHref   = editor.getAttributes('link').href ?? '';
  const canMerge   = inTable && editor.can().mergeCells();
  const canSplit   = inTable && editor.can().splitCell();
  const focusCtaIdx =
    typeof ctaButtonIndex === 'number' && ctaButtonIndex >= 0
      ? Math.min(ctaButtonIndex, Math.max(0, ctaRows.length - 1))
      : 0;

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

  const openCtaEdit = () => {
    setCtaRows(loadCtaRows(editor));
    setCtaAlign(loadCtaAlign(editor));
    setCtaHint(null);
    setCtaEdit(true);
  };

  const updateCtaRow = (index, field, value) => {
    setCtaRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addCtaRow = () => {
    setCtaRows((prev) => {
      if (prev.length >= CTA_BUTTONS_MAX) return prev;
      return [...prev, { label: '', href: '' }];
    });
    setCtaHint(null);
  };

  const removeCtaRow = (index) => {
    setCtaRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
    setCtaHint(null);
  };

  const applyCtaEdit = () => {
    const buttons = normalizeCtaButtons(
      ctaRows.map((row) => ({
        label: row.label.trim() || '바로가기',
        href: normalizeUrl(row.href),
      }))
    );
    if (buttons.length === 0) {
      setCtaHint('URL이 있는 버튼을 1개 이상 입력해 주세요.');
      return;
    }
    editor.chain().focus().updateEditorCtaButtons({ buttons, align: ctaAlign }).run();
    onClose();
  };

  return (
    <div
      ref={ref}
      className={`ecm${ctaEdit && onCta ? ' ecm--cta' : ''}`}
      style={style}
      role="menu"
      aria-label="에디터 메뉴"
    >

      {/* ── 실행 취소 / 다시 실행 ── */}
      {!ctaEdit && (
        <>
          <Item icon={icons.undo} label="실행 취소" shortcut="Ctrl+Z"
            disabled={!editor.can().undo()}
            onClick={() => run(() => editor.chain().focus().undo().run())} />
          <Item icon={icons.redo} label="다시 실행" shortcut="Ctrl+Y"
            disabled={!editor.can().redo()}
            onClick={() => run(() => editor.chain().focus().redo().run())} />
          <Sep />
        </>
      )}

      {/* ── 선택 영역 서식 (텍스트 선택 시만) ── */}
      {hasSelect && !onCta && !linkInput && (
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
          <Item icon={icons.subscript} label="아래 첨자"
            onClick={() => run(() => editor.chain().focus().toggleSubscript().run())} />
          <Item icon={icons.superscript} label="위 첨자"
            onClick={() => run(() => editor.chain().focus().toggleSuperscript().run())} />
          <Sep />
        </>
      )}

      {/* ── 이미지 ── */}
      {onImage && !linkInput && (
        <>
          <Section>이미지</Section>
          <Item icon={icons.alignLeft} label="왼쪽 정렬"
            onClick={() => run(() => editor.chain().focus().updateEditorImage({ align: 'left' }).run())} />
          <Item icon={icons.alignCenter} label="가운데 정렬"
            onClick={() => run(() => editor.chain().focus().updateEditorImage({ align: 'center' }).run())} />
          <Item icon={icons.alignRight} label="오른쪽 정렬"
            onClick={() => run(() => editor.chain().focus().updateEditorImage({ align: 'right' }).run())} />
          <Item icon={icons.deleteImage} label="이미지 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteSelection().run())} />
          <Sep />
        </>
      )}

      {onYoutube && !linkInput && (
        <>
          <Section>동영상</Section>
          <Item icon={icons.deleteImage} label="영상 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteSelection().run())} />
          <Sep />
        </>
      )}

      {/* ── 바로가기 버튼 ── */}
      {onCta && !linkInput && (
        <>
          <Section>바로가기 버튼</Section>
          {!ctaEdit ? (
            <Item icon={icons.ctaButton} label="버튼 편집" onClick={openCtaEdit} />
          ) : (
            <div className="ecm__cta-panel">
              <div className="ecm__cta-align" role="group" aria-label="버튼 정렬">
                {[
                  { value: 'left', title: '왼쪽', icon: icons.alignLeft },
                  { value: 'center', title: '가운데', icon: icons.alignCenter },
                  { value: 'right', title: '오른쪽', icon: icons.alignRight },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.title}
                    aria-label={opt.title}
                    aria-pressed={ctaAlign === opt.value}
                    className={`ecm__cta-align-btn${ctaAlign === opt.value ? ' ecm__cta-align-btn--on' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setCtaAlign(opt.value);
                    }}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>

              <ul className="ecm__cta-list">
                {ctaRows.map((row, index) => (
                  <li key={index} className="ecm__cta-row">
                    <div className="ecm__cta-row-head">
                      <span className="ecm__cta-row-num">버튼 {index + 1}</span>
                      {ctaRows.length > 1 ? (
                        <button
                          type="button"
                          className="ecm__cta-row-remove"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            removeCtaRow(index);
                          }}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>
                    <input
                      ref={index === focusCtaIdx ? ctaFocusRef : undefined}
                      type="text"
                      className="ecm__cta-input"
                      value={row.label}
                      onChange={(e) => updateCtaRow(index, 'label', e.target.value)}
                      placeholder="버튼 문구"
                      maxLength={40}
                    />
                    <input
                      type="url"
                      className="ecm__cta-input"
                      value={row.href}
                      onChange={(e) => updateCtaRow(index, 'href', e.target.value)}
                      placeholder="https://example.com"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyCtaEdit();
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>

              {ctaRows.length < CTA_BUTTONS_MAX ? (
                <button
                  type="button"
                  className="ecm__cta-add"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addCtaRow();
                  }}
                >
                  + 버튼 추가
                </button>
              ) : null}

              {ctaHint ? <p className="ecm__cta-hint">{ctaHint}</p> : null}

              <div className="ecm__cta-actions">
                <button
                  type="button"
                  className="ecm__link-cancel"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="ecm__link-apply"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyCtaEdit();
                  }}
                >
                  적용
                </button>
              </div>
            </div>
          )}
          <Item icon={icons.deleteImage} label="버튼 삭제" danger
            onClick={() => run(() => editor.chain().focus().deleteSelection().run())} />
          <Sep />
        </>
      )}

      {!inTable && !onImage && !onYoutube && !onCta && !linkInput && (
        <>
          <Section>문단</Section>
          <Item icon={icons.indent} label="들여쓰기" shortcut="Tab"
            onClick={() => run(() => editor.chain().focus().indent().run())} />
          <Item icon={icons.outdent} label="내어쓰기" shortcut="Shift+Tab"
            onClick={() => run(() => editor.chain().focus().outdent().run())} />
          <Item icon={icons.codeBlock} label="코드 블록"
            onClick={() => run(() => editor.chain().focus().toggleCodeBlock().run())} />
          <Sep />
        </>
      )}

      {/* ── 링크 ── */}
      {!onCta && (onLink ? (
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
      ))}

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
      {inTable && !linkInput && !onCta && (
        <>
          <Sep />

          <Section>표 프리셋</Section>
          <Item
            label="좁은 표 (40%)"
            onClick={() => run(() => editor.chain().focus().setTablePreset('narrow').run())}
          />
          <Item
            label="중간 표 (70%)"
            onClick={() => run(() => editor.chain().focus().setTablePreset('medium').run())}
          />
          <Item
            label="전체 너비"
            onClick={() => run(() => editor.chain().focus().setTablePreset('full').run())}
          />

          <Sep />

          <Section>표 정렬</Section>
          <Item icon={icons.tableAlignLeft} label="표 왼쪽 정렬"
            onClick={() => run(() => editor.chain().focus().setTableAlign('left').run())} />
          <Item icon={icons.tableAlignCenter} label="표 가운데 정렬"
            onClick={() => run(() => editor.chain().focus().setTableAlign('center').run())} />
          <Item icon={icons.tableAlignRight} label="표 오른쪽 정렬"
            onClick={() => run(() => editor.chain().focus().setTableAlign('right').run())} />

          <Sep />

          <Section>셀 정렬</Section>
          <Item icon={icons.alignLeft} label="셀 왼쪽 정렬"
            onClick={() => run(() => editor.chain().focus().setCellAttribute('textAlign', 'left').run())} />
          <Item icon={icons.alignCenter} label="셀 가운데 정렬"
            onClick={() => run(() => editor.chain().focus().setCellAttribute('textAlign', 'center').run())} />
          <Item icon={icons.alignRight} label="셀 오른쪽 정렬"
            onClick={() => run(() => editor.chain().focus().setCellAttribute('textAlign', 'right').run())} />
          <Item icon={icons.valignTop} label="셀 위쪽 정렬"
            onClick={() => run(() => editor.chain().focus().setCellAttribute('verticalAlign', 'top').run())} />
          <Item icon={icons.valignMiddle} label="셀 세로 가운데"
            onClick={() => run(() => editor.chain().focus().setCellAttribute('verticalAlign', 'middle').run())} />
          <Item icon={icons.valignBottom} label="셀 아래쪽 정렬"
            onClick={() => run(() => editor.chain().focus().setCellAttribute('verticalAlign', 'bottom').run())} />

          <Sep />

          <Section>행</Section>
          <Item icon={icons.headerRow} label="헤더 행 켜기/끄기"
            onClick={() => run(() => editor.chain().focus().toggleHeaderRow().run())} />
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
