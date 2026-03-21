'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Link as TiptapLink } from '@tiptap/extension-link';

import icons from './icons';
import { ToolbarBtn, Divider } from './ToolbarBtn';
import TableGridPicker from './TableGridPicker';
import ColorPicker from './ColorPicker';
import LinkPicker from './LinkPicker';
import DatePicker from './DatePicker';

/**
 * 공통 리치 텍스트 에디터 페이지
 *
 * @param {object}   post          - 수정 시 기존 게시물 데이터 (null이면 신규 작성)
 * @param {string}   backHref      - 목록으로 돌아가는 경로
 * @param {string}   editTitle     - 수정 모드 제목
 * @param {string}   newTitle      - 신규 작성 모드 제목
 * @param {boolean}  showPinToggle - 공지 고정 체크박스 표시 여부
 * @param {function} onSave        - async ({ title, content, createdAt, isPinned? }) => void
 */
export default function RichEditor({
  post,
  backHref,
  editTitle,
  newTitle,
  showPinToggle = false,
  onSave,
}) {
  const router  = useRouter();
  const isEdit  = Boolean(post);

  const [title,           setTitle]           = useState(post?.title    ?? '');
  const [isPinned,        setIsPinned]        = useState(post?.isPinned ?? false);
  const [createdAt,       setCreatedAt]       = useState(
    post?.createdAt ?? new Date().toISOString().slice(0, 10)
  );
  const [saving,          setSaving]          = useState(false);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading:     { levels: [1, 2, 3] },
        bulletList:  { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextStyle,
      Color,
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '본문을 입력하세요...' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: post?.content ?? '',
    editorProps: {
      attributes: { class: 'ep-content', spellCheck: 'false' },
    },
  });

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    const html = editor?.getHTML() ?? '';
    if (!html || html === '<p></p>') {
      alert('내용을 입력해 주세요.');
      return;
    }
    setSaving(true);
    try {
      await onSave({ title, content: html, createdAt, isPinned });
      router.push(backHref);
      router.refresh();
    } catch {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  }, [title, createdAt, isPinned, onSave, backHref, router, editor]);

  return (
    <div className="ep">
      {/* 액션 바 */}
      <div className="ep__actionbar">
        <div className="ep__actionbar-inner">
          <Link href={backHref} className="ep__back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 3L5 7L8.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            목록으로
          </Link>
          <span className="ep__actionbar-title">
            {isEdit ? editTitle : newTitle}
          </span>
          <div className="ep__actionbar-btns">
            <Link href={backHref} className="an-btn an-btn--secondary an-btn--sm">
              취소
            </Link>
            <button
              className="an-btn an-btn--primary an-btn--sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '게시하기'}
            </button>
          </div>
        </div>
      </div>

      {/* 에디터 영역 */}
      <main className="ep__main">
        <div className="ep__paper">

          {/* 메타 행 (공지 고정 / 작성일) */}
          <div className="ep__meta-row">
            {showPinToggle && (
              <label className="an-check">
                <input
                  type="checkbox"
                  className="an-check__input"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <span className="an-check__box" aria-hidden="true">
                  <svg className="an-check__mark" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="an-check__label">공지로 고정</span>
              </label>
            )}
            <div className="ep__meta-date">
              <span className="ep__meta-date-label">작성일</span>
              <DatePicker value={createdAt} onChange={setCreatedAt} />
            </div>
          </div>

          {/* 제목 입력 */}
          <input
            type="text"
            className="ep__title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
          />

          {/* 포매팅 툴바 */}
          <div className="ep-toolbar" role="toolbar" aria-label="텍스트 서식">
            <div className="ep-toolbar__group">
              <ToolbarBtn title="실행 취소 (Ctrl+Z)" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}>
                {icons.undo}
              </ToolbarBtn>
              <ToolbarBtn title="다시 실행 (Ctrl+Y)" disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}>
                {icons.redo}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn
                title="본문"
                active={editor?.isActive('paragraph') && !editor?.isActive('heading')}
                onClick={() => editor?.chain().focus().setParagraph().run()}
              >
                <span className="ep-toolbar__label">본문</span>
              </ToolbarBtn>
              <ToolbarBtn title="제목 1" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <span className="ep-toolbar__label ep-toolbar__label--h1">H1</span>
              </ToolbarBtn>
              <ToolbarBtn title="제목 2" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <span className="ep-toolbar__label">H2</span>
              </ToolbarBtn>
              <ToolbarBtn title="제목 3" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                <span className="ep-toolbar__label">H3</span>
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="굵게 (Ctrl+B)"   active={editor?.isActive('bold')}      onClick={() => editor?.chain().focus().toggleBold().run()}>{icons.bold}</ToolbarBtn>
              <ToolbarBtn title="기울임 (Ctrl+I)" active={editor?.isActive('italic')}    onClick={() => editor?.chain().focus().toggleItalic().run()}>{icons.italic}</ToolbarBtn>
              <ToolbarBtn title="밑줄 (Ctrl+U)"   active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>{icons.underline}</ToolbarBtn>
              <ToolbarBtn title="취소선"           active={editor?.isActive('strike')}    onClick={() => editor?.chain().focus().toggleStrike().run()}>{icons.strike}</ToolbarBtn>
              <ColorPicker editor={editor} />
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="글머리 기호 목록" active={editor?.isActive('bulletList')}  onClick={() => editor?.chain().focus().toggleBulletList().run()}>{icons.bulletList}</ToolbarBtn>
              <ToolbarBtn title="번호 매기기 목록" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>{icons.orderedList}</ToolbarBtn>
              <ToolbarBtn title="인용구"           active={editor?.isActive('blockquote')}  onClick={() => editor?.chain().focus().toggleBlockquote().run()}>{icons.blockquote}</ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="왼쪽 정렬"   active={editor?.isActive({ textAlign: 'left' })}   onClick={() => editor?.chain().focus().setTextAlign('left').run()}>{icons.alignLeft}</ToolbarBtn>
              <ToolbarBtn title="가운데 정렬" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>{icons.alignCenter}</ToolbarBtn>
              <ToolbarBtn title="오른쪽 정렬" active={editor?.isActive({ textAlign: 'right' })}  onClick={() => editor?.chain().focus().setTextAlign('right').run()}>{icons.alignRight}</ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <ToolbarBtn title="구분선" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                {icons.hr}
              </ToolbarBtn>
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <LinkPicker editor={editor} />
            </div>

            <Divider />

            <div className="ep-toolbar__group">
              <div className="ep-tbl-wrap">
                <ToolbarBtn title="표 삽입" active={tablePickerOpen} onClick={() => setTablePickerOpen((o) => !o)}>
                  {icons.table}
                </ToolbarBtn>
                {tablePickerOpen && (
                  <TableGridPicker
                    onSelect={(rows, cols) => {
                      editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                      setTablePickerOpen(false);
                    }}
                    onClose={() => setTablePickerOpen(false)}
                  />
                )}
              </div>
            </div>

            {editor?.isActive('table') && (
              <>
                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="위에 행 삽입"    onClick={() => editor.chain().focus().addRowBefore().run()}>{icons.rowBefore}</ToolbarBtn>
                  <ToolbarBtn title="아래에 행 삽입"  onClick={() => editor.chain().focus().addRowAfter().run()}>{icons.rowAfter}</ToolbarBtn>
                  <ToolbarBtn title="행 삭제"         onClick={() => editor.chain().focus().deleteRow().run()}>{icons.deleteRow}</ToolbarBtn>
                </div>
                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="왼쪽에 열 삽입"  onClick={() => editor.chain().focus().addColumnBefore().run()}>{icons.colBefore}</ToolbarBtn>
                  <ToolbarBtn title="오른쪽에 열 삽입" onClick={() => editor.chain().focus().addColumnAfter().run()}>{icons.colAfter}</ToolbarBtn>
                  <ToolbarBtn title="열 삭제"         onClick={() => editor.chain().focus().deleteColumn().run()}>{icons.deleteCol}</ToolbarBtn>
                </div>
                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="셀 병합" disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()}>{icons.mergeCells}</ToolbarBtn>
                  <ToolbarBtn title="셀 분리" disabled={!editor.can().splitCell()}  onClick={() => editor.chain().focus().splitCell().run()}>{icons.splitCell}</ToolbarBtn>
                </div>
                <Divider />
                <div className="ep-toolbar__group">
                  <ToolbarBtn title="표 삭제" onClick={() => editor.chain().focus().deleteTable().run()}>{icons.deleteTable}</ToolbarBtn>
                </div>
              </>
            )}
          </div>

          {/* 본문 편집 영역 */}
          <EditorContent editor={editor} className="ep-editor-wrap" />
        </div>
      </main>
    </div>
  );
}
