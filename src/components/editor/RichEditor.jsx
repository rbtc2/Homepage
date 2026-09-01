'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomTable } from './CustomTable';
import { CustomTableRow } from './CustomTableRow';
import { CustomTableCell } from './CustomTableCell';
import { CustomTableHeader } from './CustomTableHeader';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { EditorImage } from './EditorImage';
import { EditorAttachment } from './EditorAttachment';
import { EditorYoutube } from './EditorYoutube';
import { Indent } from './Indent';
import { Subscript, Superscript } from './SubSup';

import icons from './icons';
import { ToolbarBtn, Divider } from './ToolbarBtn';
import TableGridPicker from './TableGridPicker';
import ColorPicker from './ColorPicker';
import HighlightPicker from './HighlightPicker';
import FontSizePicker from './FontSizePicker';
import LinkPicker from './LinkPicker';
import ImagePicker from './ImagePicker';
import AttachmentPicker from './AttachmentPicker';
import YoutubePicker from './YoutubePicker';
import ToolbarMoreMenu from './ToolbarMoreMenu';
import ImageToolbar from './ImageToolbar';
import TableToolbar from './TableToolbar';
import EditorContextMenu from './EditorContextMenu';
import EditorPageFrame from './EditorPageFrame';
import EditorCheckboxField from './EditorCheckboxField';
import EditorMetaDate from './EditorMetaDate';
import EditorCoverUrlField from './EditorCoverUrlField';
import DraftLoadModal from './DraftLoadModal';
import SpecialCharacterPicker from './SpecialCharacterPicker';
import FindReplaceBar from './FindReplaceBar';
import EditorPreviewModal from './EditorPreviewModal';
import ShortcutHelpModal from './ShortcutHelpModal';
import { deleteAdminDraft, getAdminDraft, saveAdminDraft } from '@/app/admin/drafts/actions';
import { cleanPastedHtml } from '@/lib/clean-pasted-html';
import { coverWidthToInput } from '@/lib/cover-image-width';
import { getClipboardImageFiles, insertDroppedImages } from './insert-editor-image-file';

/**
 * 공통 리치 텍스트 에디터 페이지
 *
 * @param {object}   post             - 수정 시 기존 게시물 데이터 (null이면 신규 작성)
 * @param {string}   contentType      - admin_drafts.content_type (notices, wr_news, …)
 * @param {string}   backHref         - 목록으로 돌아가는 경로
 * @param {string}   editTitle        - 수정 모드 제목
 * @param {string}   newTitle         - 신규 작성 모드 제목
 * @param {boolean}  showPinToggle    - 공지 고정 체크박스 표시 여부
 * @param {boolean}  showSecretToggle - 비밀글 토글 및 비밀번호 입력 표시 여부
 * @param {boolean}  showCoverImage   - 커버 이미지 URL 입력 표시 여부 (갤러리용)
 * @param {boolean}  [showCoverWidth=false] - 커버 본문 표시 너비(px) 입력 (WR뉴스)
 * @param {boolean}  [showMetaDate=true] - 작성일 입력 표시 여부
 * @param {string}   [titlePlaceholder]
 * @param {string}   [saveLabel]      - 저장 버튼 문구 (없으면 신규/수정 기본값)
 * @param {import('react').ReactNode} [notice] - 제목 위 안내
 * @param {'wr-news'|'gallery'} [coverUploadFolder] - 설정 시 Storage에서 파일 업로드 가능
 * @param {function} onSave           - async ({ title, content, createdAt, isPinned?, coverImage?, coverWidth?, isSecret?, secretPassword? }) => void
 */
export default function RichEditor({
  post,
  contentType,
  backHref,
  editTitle,
  newTitle,
  showPinToggle = false,
  showSecretToggle = false,
  showCoverImage = false,
  showCoverWidth = false,
  showMetaDate = true,
  titlePlaceholder = '제목을 입력하세요',
  saveLabel,
  notice,
  coverUploadFolder,
  onSave,
}) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? '');
  const [isPinned, setIsPinned] = useState(post?.isPinned ?? false);
  const [isSecret, setIsSecret] = useState(post?.isSecret ?? false);
  const [secretPassword, setSecretPassword] = useState('');
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [coverWidth, setCoverWidth] = useState(() => coverWidthToInput(post?.coverWidth));
  const [createdAt, setCreatedAt] = useState(
    post?.createdAt ?? new Date().toISOString().slice(0, 10)
  );
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [findOpen, setFindOpen] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shortcutOpen, setShortcutOpen] = useState(false);
  const [draftHint, setDraftHint] = useState('');
  const [charCount, setCharCount] = useState(0);
  const findCtl = useRef({ openFind() {}, openReplace() {} });
  const autoSaveLock = useRef(false);
  const skipAutoSave = useRef(true);

  findCtl.current = {
    openFind: () => {
      setReplaceMode(false);
      setFindOpen(true);
    },
    openReplace: () => {
      setReplaceMode(true);
      setFindOpen(true);
    },
  };

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
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Placeholder.configure({ placeholder: '본문을 입력하세요...' }),
      CustomTable.configure({ resizable: true }),
      CustomTableRow,
      CustomTableHeader,
      CustomTableCell,
      Indent,
      EditorImage,
      EditorAttachment,
      EditorYoutube,
    ],
    content: post?.content ?? '',
    editorProps: {
      attributes: { class: 'ep-content', spellCheck: 'true' },
      transformPastedHTML: (html) => cleanPastedHtml(html),
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = getClipboardImageFiles(event.dataTransfer);
        if (files.length === 0) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertDroppedImages(view, files, pos);
        return true;
      },
      handlePaste: (view, event) => {
        const files = getClipboardImageFiles(event.clipboardData);
        if (files.length === 0) return false;
        const html = event.clipboardData?.getData('text/html') ?? '';
        const text = event.clipboardData?.getData('text/plain') ?? '';
        if (html && /<(p|h1|h2|h3|table|ul|ol|div)/i.test(html) && text.trim()) {
          return false;
        }
        event.preventDefault();
        void insertDroppedImages(view, files);
        return true;
      },
      handleDOMEvents: {
        contextmenu: (_view, event) => {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
          return true;
        },
      },
      handleKeyDown: (view, event) => {
        const mod = event.ctrlKey || event.metaKey;
        if (mod && event.key.toLowerCase() === 'f') {
          event.preventDefault();
          findCtl.current.openFind();
          return true;
        }
        if (mod && event.key.toLowerCase() === 'h') {
          event.preventDefault();
          findCtl.current.openReplace();
          return true;
        }
        if (document.activeElement?.closest('.ep-img-bubble')) {
          return true;
        }
        const { selection } = view.state;
        if (
          selection instanceof NodeSelection &&
          selection.node.type.name === 'editorImage' &&
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          return true;
        }
        return false;
      },
      handleTextInput: (view) => {
        const { selection } = view.state;
        if (
          selection instanceof NodeSelection &&
          selection.node.type.name === 'editorImage'
        ) {
          return true;
        }
        if (document.activeElement?.closest('.ep-img-bubble')) {
          return true;
        }
        return false;
      },
      handleClick: (view, _pos, event) => {
        const target = event.target;
        if (target instanceof Element && target.closest('.ep-img-bubble')) {
          return true;
        }
        if (target instanceof Element && target.closest('.ep-img-resize-handle')) {
          return true;
        }
        if (!(target instanceof Element)) return false;
        const block = target.closest('.ep-img-block');
        if (!block || !view.dom.contains(block)) return false;
        try {
          const nodePos = view.posAtDOM(block, 0);
          const node = view.state.doc.nodeAt(nodePos);
          if (node?.type.name !== 'editorImage') return false;
          const { tr } = view.state;
          view.dispatch(tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
          return true;
        } catch {
          return false;
        }
      },
    },
  });

  const buildDraftPayload = useCallback(() => {
    const html = editor?.getHTML() ?? '';
    return {
      title,
      content: html,
      createdAt,
      isPinned,
      isSecret,
      coverImage: coverImage.trim() || null,
      coverWidth: coverWidthToInput(coverWidth),
    };
  }, [title, createdAt, isPinned, isSecret, coverImage, coverWidth, editor]);

  const applyDraftPayload = useCallback(
    (payload) => {
      setTitle(payload?.title ?? '');
      setCreatedAt(payload?.createdAt ?? new Date().toISOString().slice(0, 10));
      setIsPinned(Boolean(payload?.isPinned));
      setIsSecret(Boolean(payload?.isSecret));
      setCoverImage(payload?.coverImage ?? '');
      setCoverWidth(coverWidthToInput(payload?.coverWidth));
      setSecretPassword('');
      const html = payload?.content ?? '';
      editor?.commands.setContent(html || '<p></p>');
    },
    [editor]
  );

  const persistDraft = useCallback(
    async ({ silent = false } = {}) => {
      const html = editor?.getHTML() ?? '';
      const emptyBody = !html || html === '<p></p>';
      if (silent && !title.trim() && emptyBody) return null;

      if (silent) {
        if (autoSaveLock.current) return null;
        autoSaveLock.current = true;
      } else {
        setDraftSaving(true);
      }
      try {
        const saved = await saveAdminDraft({
          id: draftId,
          contentType,
          sourcePostId: post?.id ?? null,
          payload: buildDraftPayload(),
        });
        setDraftId(saved.id);
        const time = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setDraftHint(silent ? `자동 저장 ${time}` : `임시저장 ${time}`);
        if (!silent) alert('임시저장되었습니다.');
        return saved;
      } catch {
        if (silent) setDraftHint('자동 저장 실패');
        else alert('임시저장에 실패했습니다. 다시 시도해 주세요.');
        return null;
      } finally {
        if (silent) autoSaveLock.current = false;
        else setDraftSaving(false);
      }
    },
    [draftId, contentType, post?.id, buildDraftPayload, editor, title]
  );

  const handleDraftSave = useCallback(() => persistDraft({ silent: false }), [persistDraft]);

  const handleDraftLoad = useCallback(
    async (loadDraftId) => {
      try {
        const draft = await getAdminDraft(loadDraftId);
        if (draft.contentType !== contentType) {
          alert('다른 게시판의 임시저장입니다.');
          return;
        }
        applyDraftPayload(draft.payload);
        setDraftId(draft.id);
        setDraftModalOpen(false);
      } catch {
        alert('임시저장을 불러오지 못했습니다.');
      }
    },
    [contentType, applyDraftPayload]
  );

  useEffect(() => {
    if (!editor) return undefined;
    const updateCount = () => setCharCount(editor.getText().length);
    updateCount();
    editor.on('update', updateCount);
    return () => editor.off('update', updateCount);
  }, [editor]);

  useEffect(() => {
    skipAutoSave.current = true;
    const ready = setTimeout(() => {
      skipAutoSave.current = false;
    }, 2500);
    return () => clearTimeout(ready);
  }, [editor]);

  useEffect(() => {
    if (!editor || !contentType) return undefined;
    let timer;
    const schedule = () => {
      if (skipAutoSave.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        void persistDraft({ silent: true });
      }, 8000);
    };
    editor.on('update', schedule);
    schedule();
    return () => {
      editor.off('update', schedule);
      clearTimeout(timer);
    };
  }, [editor, contentType, persistDraft, title]);

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
    if (showSecretToggle && isSecret && !secretPassword.trim() && !post?.hasSecretPassword) {
      alert('비밀글 비밀번호를 입력해 주세요.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title,
        content: html,
        createdAt,
        isPinned,
        coverImage: coverImage.trim() || null,
        coverWidth: showCoverWidth ? coverWidthToInput(coverWidth) : undefined,
        isSecret,
        secretPassword,
      });
      if (draftId) {
        try {
          await deleteAdminDraft(draftId);
        } catch {
          /* 게시는 성공 — 임시저장 삭제 실패는 무시 */
        }
      }
      router.refresh();
      router.push(backHref);
    } catch (err) {
      const detail =
        err instanceof Error && err.message
          ? err.message
          : '저장에 실패했습니다. 다시 시도해 주세요.';
      console.error('[RichEditor] save failed:', err);
      alert(detail);
    } finally {
      setSaving(false);
    }
  }, [
    title,
    createdAt,
    isPinned,
    isSecret,
    secretPassword,
    coverImage,
    coverWidth,
    showCoverWidth,
    showSecretToggle,
    post?.hasSecretPassword,
    onSave,
    backHref,
    router,
    editor,
    draftId,
  ]);

  const pageTitle = isEdit ? editTitle : newTitle;
  const primaryLabel = saveLabel ?? (isEdit ? '수정 완료' : '게시하기');
  const showDrafts = Boolean(contentType);
  const showMetaRow = showPinToggle || showSecretToggle || showMetaDate;

  return (
    <EditorPageFrame
      backHref={backHref}
      pageTitle={pageTitle}
      saving={saving}
      onSave={handleSave}
      primaryLabel={primaryLabel}
      onDraftSave={showDrafts ? handleDraftSave : undefined}
      onDraftLoadOpen={showDrafts ? () => setDraftModalOpen(true) : undefined}
      draftSaving={draftSaving}
      draftHint={draftHint}
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
      {showMetaRow ? (
        <div className="ep__meta-row">
          {showPinToggle ? (
            <EditorCheckboxField checked={isPinned} onChange={setIsPinned} label="공지로 고정" />
          ) : null}
          {showSecretToggle ? (
            <EditorCheckboxField checked={isSecret} onChange={setIsSecret} label="비밀 게시글" />
          ) : null}
          {showMetaDate ? (
            <EditorMetaDate label="작성일" value={createdAt} onChange={setCreatedAt} />
          ) : null}
        </div>
      ) : null}
      {notice ? <div className="ep__notice">{notice}</div> : null}

      {showSecretToggle && isSecret && (
        <input
          type="password"
          className="ep__title-input"
          value={secretPassword}
          onChange={(e) => setSecretPassword(e.target.value)}
          placeholder={isEdit ? '비밀번호 변경 시에만 입력하세요' : '열람 비밀번호를 입력하세요'}
          autoComplete="new-password"
          maxLength={100}
        />
      )}

      <input
        type="text"
        className="ep__title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={titlePlaceholder}
        maxLength={100}
      />

      {showCoverImage && (
        <EditorCoverUrlField
          label="커버 이미지 URL"
          value={coverImage}
          onChange={setCoverImage}
          placeholder="https://example.com/image.jpg"
          uploadFolder={coverUploadFolder}
          showWidthControl={showCoverWidth}
          widthPx={coverWidth}
          onWidthPxChange={setCoverWidth}
        />
      )}

      <div className="ep-toolbar-stack">
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
          <ToolbarBtn
            title="제목 1"
            active={editor?.isActive('heading', { level: 1 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <span className="ep-toolbar__label ep-toolbar__label--h1">H1</span>
          </ToolbarBtn>
          <ToolbarBtn
            title="제목 2"
            active={editor?.isActive('heading', { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <span className="ep-toolbar__label">H2</span>
          </ToolbarBtn>
          <ToolbarBtn
            title="제목 3"
            active={editor?.isActive('heading', { level: 3 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <span className="ep-toolbar__label">H3</span>
          </ToolbarBtn>
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <FontSizePicker editor={editor} />
          <ToolbarBtn
            title="굵게 (Ctrl+B)"
            active={editor?.isActive('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            {icons.bold}
          </ToolbarBtn>
          <ToolbarBtn
            title="기울임 (Ctrl+I)"
            active={editor?.isActive('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            {icons.italic}
          </ToolbarBtn>
          <ToolbarBtn
            title="밑줄 (Ctrl+U)"
            active={editor?.isActive('underline')}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            {icons.underline}
          </ToolbarBtn>
          <ColorPicker editor={editor} />
          <HighlightPicker editor={editor} />
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <ToolbarBtn
            title="글머리 기호 목록"
            active={editor?.isActive('bulletList')}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            {icons.bulletList}
          </ToolbarBtn>
          <ToolbarBtn
            title="번호 매기기 목록"
            active={editor?.isActive('orderedList')}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            {icons.orderedList}
          </ToolbarBtn>
          <ToolbarBtn title="들여쓰기 (Tab)" onClick={() => editor?.chain().focus().indent().run()}>
            {icons.indent}
          </ToolbarBtn>
          <ToolbarBtn title="내어쓰기 (Shift+Tab)" onClick={() => editor?.chain().focus().outdent().run()}>
            {icons.outdent}
          </ToolbarBtn>
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <ToolbarBtn
            title="왼쪽 정렬"
            active={editor?.isActive({ textAlign: 'left' })}
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          >
            {icons.alignLeft}
          </ToolbarBtn>
          <ToolbarBtn
            title="가운데 정렬"
            active={editor?.isActive({ textAlign: 'center' })}
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          >
            {icons.alignCenter}
          </ToolbarBtn>
          <ToolbarBtn
            title="오른쪽 정렬"
            active={editor?.isActive({ textAlign: 'right' })}
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          >
            {icons.alignRight}
          </ToolbarBtn>
          <ToolbarBtn
            title="양쪽 정렬"
            active={editor?.isActive({ textAlign: 'justify' })}
            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
          >
            {icons.alignJustify}
          </ToolbarBtn>
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <LinkPicker editor={editor} />
          {editor?.isActive('link') ? (
            <ToolbarBtn title="링크 해제" onClick={() => editor.chain().focus().unsetLink().run()}>
              {icons.unlink}
            </ToolbarBtn>
          ) : null}
          <ImagePicker editor={editor} />
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
          <YoutubePicker editor={editor} />
          <AttachmentPicker editor={editor} />
          <SpecialCharacterPicker editor={editor} />
        </div>

        <Divider />

        <div className="ep-toolbar__group">
          <ToolbarMoreMenu
            editor={editor}
            onFind={() => findCtl.current.openFind()}
            onReplace={() => findCtl.current.openReplace()}
            onPreview={() => setPreviewOpen(true)}
            onShortcuts={() => setShortcutOpen(true)}
          />
        </div>
        </div>
        <TableToolbar editor={editor} />
      </div>

      <FindReplaceBar
        editor={editor}
        open={findOpen}
        replaceMode={replaceMode}
        onClose={() => setFindOpen(false)}
      />
      <EditorContent editor={editor} className="ep-editor-wrap" />
      <p className="ep-editor-status">글자 수 {charCount.toLocaleString('ko-KR')}</p>
      <ImageToolbar editor={editor} />

      <DraftLoadModal
        open={showDrafts && draftModalOpen}
        contentType={contentType}
        onClose={() => setDraftModalOpen(false)}
        onLoad={handleDraftLoad}
      />
      <EditorPreviewModal
        open={previewOpen}
        title={title}
        html={editor?.getHTML() ?? ''}
        coverImage={showCoverImage ? coverImage.trim() : ''}
        coverWidth={showCoverWidth ? coverWidth : ''}
        onClose={() => setPreviewOpen(false)}
      />
      <ShortcutHelpModal open={shortcutOpen} onClose={() => setShortcutOpen(false)} />
    </EditorPageFrame>
  );
}
