'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow } from '@tiptap/extension-table';
import { CustomTableCell } from './CustomTableCell';
import { CustomTableHeader } from './CustomTableHeader';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Link as TiptapLink } from '@tiptap/extension-link';

import icons from './icons';
import { ToolbarBtn, Divider } from './ToolbarBtn';
import TableGridPicker from './TableGridPicker';
import ColorPicker from './ColorPicker';
import LinkPicker from './LinkPicker';
import TableToolbar from './TableToolbar';
import EditorContextMenu from './EditorContextMenu';
import EditorPageFrame from './EditorPageFrame';
import EditorCheckboxField from './EditorCheckboxField';
import EditorMetaDate from './EditorMetaDate';
import EditorCoverUrlField from './EditorCoverUrlField';

/**
 * 공통 리치 텍스트 에디터 페이지
 *
 * @param {object}   post             - 수정 시 기존 게시물 데이터 (null이면 신규 작성)
 * @param {string}   backHref         - 목록으로 돌아가는 경로
 * @param {string}   editTitle        - 수정 모드 제목
 * @param {string}   newTitle         - 신규 작성 모드 제목
 * @param {boolean}  showPinToggle    - 공지 고정 체크박스 표시 여부
 * @param {boolean}  showCoverImage   - 커버 이미지 URL 입력 표시 여부 (갤러리용)
 * @param {function} onSave           - async ({ title, content, createdAt, isPinned?, coverImage? }) => void
 */
export default function RichEditor({
  post,
  backHref,
  editTitle,
  newTitle,
  showPinToggle = false,
  showCoverImage = false,
  onSave,
}) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? '');
  const [isPinned, setIsPinned] = useState(post?.isPinned ?? false);
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [createdAt, setCreatedAt] = useState(
    post?.createdAt ?? new Date().toISOString().slice(0, 10)
  );
  const [saving, setSaving] = useState(false);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
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
      CustomTableHeader,
      CustomTableCell,
    ],
    content: post?.content ?? '',
    editorProps: {
      attributes: { class: 'ep-content', spellCheck: 'false' },
      handleDOMEvents: {
        contextmenu: (_view, event) => {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
          return true;
        },
      },
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
      await onSave({ title, content: html, createdAt, isPinned, coverImage: coverImage.trim() || null });
      router.push(backHref);
    } catch {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  }, [title, createdAt, isPinned, coverImage, onSave, backHref, router, editor]);

  const pageTitle = isEdit ? editTitle : newTitle;
  const primaryLabel = isEdit ? '수정 완료' : '게시하기';

  return (
    <EditorPageFrame
      backHref={backHref}
      pageTitle={pageTitle}
      saving={saving}
      onSave={handleSave}
      primaryLabel={primaryLabel}
      footer={
        contextMenu ? (
          <EditorContextMenu
            editor={editor}
            pos={contextMenu}
            onClose={() => setContextMenu(null)}
          />
        ) : null
      }
    >
      <div className="ep__meta-row">
        {showPinToggle && (
          <EditorCheckboxField checked={isPinned} onChange={setIsPinned} label="공지로 고정" />
        )}
        <EditorMetaDate label="작성일" value={createdAt} onChange={setCreatedAt} />
      </div>

      <input
        type="text"
        className="ep__title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        maxLength={100}
      />

      {showCoverImage && (
        <EditorCoverUrlField
          label="커버 이미지 URL"
          value={coverImage}
          onChange={setCoverImage}
          placeholder="https://example.com/image.jpg"
        />
      )}

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
          <ToolbarBtn title="굵게 (Ctrl+B)" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
            {icons.bold}
          </ToolbarBtn>
          <ToolbarBtn title="기울임 (Ctrl+I)" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            {icons.italic}
          </ToolbarBtn>
          <ToolbarBtn title="밑줄 (Ctrl+U)" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
            {icons.underline}
          </ToolbarBtn>
          <ToolbarBtn title="취소선" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
            {icons.strike}
          </ToolbarBtn>
          <ColorPicker editor={editor} />
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <ToolbarBtn title="글머리 기호 목록" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            {icons.bulletList}
          </ToolbarBtn>
          <ToolbarBtn title="번호 매기기 목록" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            {icons.orderedList}
          </ToolbarBtn>
          <ToolbarBtn title="인용구" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
            {icons.blockquote}
          </ToolbarBtn>
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <ToolbarBtn title="왼쪽 정렬" active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
            {icons.alignLeft}
          </ToolbarBtn>
          <ToolbarBtn title="가운데 정렬" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
            {icons.alignCenter}
          </ToolbarBtn>
          <ToolbarBtn title="오른쪽 정렬" active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
            {icons.alignRight}
          </ToolbarBtn>
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

        <TableToolbar editor={editor} />
      </div>

      <EditorContent editor={editor} className="ep-editor-wrap" />
    </EditorPageFrame>
  );
}
