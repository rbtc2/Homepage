'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Link as TiptapLink } from '@tiptap/extension-link';

import EditorPageFrame from '@/components/editor/EditorPageFrame';
import EditorCheckboxField from '@/components/editor/EditorCheckboxField';
import EditorMetaDate from '@/components/editor/EditorMetaDate';
import EditorCoverUrlField from '@/components/editor/EditorCoverUrlField';

/**
 * 언론보도 전용 편집기 — 공지/갤러리 에디터(ep-*)와 동일한 레이아웃 규칙을 따릅니다.
 */
export default function PressEditor({ post, backHref, editTitle, newTitle, onSave }) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? '');
  const [sourceName, setSourceName] = useState(post?.sourceName ?? '');
  const [articleUrl, setArticleUrl] = useState(post?.articleUrl ?? '');
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt ?? new Date().toISOString().slice(0, 10));
  const [createdAt, setCreatedAt] = useState(post?.createdAt ?? new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState(post?.summary ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnailUrl ?? '');
  const [isFeatured, setIsFeatured] = useState(post?.isFeatured ?? false);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder: '본문 요약·인용·추가 안내를 입력하세요 (선택)' }),
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
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
    if (!sourceName.trim()) {
      alert('언론사(매체명)를 입력해 주세요.');
      return;
    }
    if (!articleUrl.trim()) {
      alert('원문 URL을 입력해 주세요.');
      return;
    }
    const urlStr = articleUrl.trim();
    try {
      const u = new URL(urlStr);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('invalid protocol');
    } catch {
      alert('원문 URL 형식을 확인해 주세요.');
      return;
    }
    setSaving(true);
    try {
      const html = editor?.getHTML() ?? '';
      await onSave({
        title,
        sourceName,
        articleUrl,
        publishedAt,
        createdAt,
        summary,
        thumbnailUrl: thumbnailUrl.trim() || null,
        content: html,
        isFeatured,
      });
      router.push(backHref);
    } catch {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  }, [
    title,
    sourceName,
    articleUrl,
    publishedAt,
    createdAt,
    summary,
    thumbnailUrl,
    isFeatured,
    onSave,
    backHref,
    router,
    editor,
  ]);

  const pageTitle = isEdit ? editTitle : newTitle;
  const primaryLabel = isEdit ? '수정 완료' : '등록하기';

  return (
    <EditorPageFrame
      backHref={backHref}
      pageTitle={pageTitle}
      saving={saving}
      onSave={handleSave}
      primaryLabel={primaryLabel}
      paperClassName="press-ep"
    >
      <div className="ep__meta-row press-ep__meta-row">
        <EditorCheckboxField checked={isFeatured} onChange={setIsFeatured} label="목록 상단 대표 노출" />
        <EditorMetaDate label="기사 게재일" value={publishedAt} onChange={setPublishedAt} />
        <EditorMetaDate label="사이트 등록일" value={createdAt} onChange={setCreatedAt} />
      </div>

      <p className="press-ep__hint">
        외부에 게재된 기사를 소개합니다. <strong>원문 URL</strong>과 <strong>게재일</strong>을 정확히 입력해 주세요.
      </p>

      <input
        type="text"
        className="ep__title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="기사 제목을 입력하세요"
        maxLength={200}
      />

      <div className="press-ep__block">
        <div className="press-ep__grid2">
          <label className="press-ep__field press-ep__field--tight">
            <span className="press-ep__label">언론사 · 매체</span>
            <input
              type="text"
              className="press-ep__input"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="예: ○○일보"
              maxLength={120}
            />
          </label>
          <label className="press-ep__field press-ep__field--tight">
            <span className="press-ep__label">원문 URL</span>
            <input
              type="url"
              className="press-ep__input"
              value={articleUrl}
              onChange={(e) => setArticleUrl(e.target.value)}
              placeholder="https://"
            />
          </label>
        </div>
        <label className="press-ep__field press-ep__field--tight">
          <span className="press-ep__label">목록용 요약</span>
          <textarea
            className="press-ep__textarea"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="기사 첫 줄을 복사하거나 기사 핵심을 1~2문장으로 요약해주세요."
            rows={3}
            maxLength={500}
          />
        </label>
      </div>

      <EditorCoverUrlField
        label="썸네일 이미지 URL (선택)"
        value={thumbnailUrl}
        onChange={setThumbnailUrl}
        placeholder="https://"
        wrapperClassName="press-ep__thumb"
        showPreview={false}
      />

      <div className="press-ep__body">
        <div className="ep-toolbar ep-toolbar--press" role="toolbar" aria-label="추가 본문 서식">
          <div className="ep-toolbar__group">
            <span className="press-ep__toolbar-label">추가 본문 (선택)</span>
          </div>
          <div className="ep-toolbar__group">
            <button
              type="button"
              className={`ep-toolbar__btn${editor?.isActive('bold') ? ' ep-toolbar__btn--on' : ''}`}
              title="굵게"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              굵게
            </button>
            <button
              type="button"
              className={`ep-toolbar__btn${editor?.isActive('bulletList') ? ' ep-toolbar__btn--on' : ''}`}
              title="목록"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              목록
            </button>
            <button
              type="button"
              className="ep-toolbar__btn"
              title="링크"
              disabled={!editor}
              onClick={() => {
                const url = window.prompt('링크 URL');
                if (url) editor?.chain().focus().setLink({ href: url }).run();
              }}
            >
              링크
            </button>
          </div>
        </div>
        <EditorContent editor={editor} className="ep-editor-wrap" />
      </div>
    </EditorPageFrame>
  );
}
