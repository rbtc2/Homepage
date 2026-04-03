'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Link as TiptapLink } from '@tiptap/extension-link';
import DatePicker from '@/components/editor/DatePicker';

/**
 * 언론보도 전용 편집기 — 원문 URL·언론사·게재일 중심, 본문은 선택
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
      attributes: { class: 'ep-content press-ep__editor', spellCheck: 'false' },
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
    try {
      // eslint-disable-next-line no-new
      new URL(articleUrl.trim());
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

  return (
    <div className="ep">
      <div className="ep__actionbar">
        <div className="ep__actionbar-inner">
          <Link href={backHref} className="ep__back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M8.5 3L5 7L8.5 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            목록으로
          </Link>
          <span className="ep__actionbar-title">{isEdit ? editTitle : newTitle}</span>
          <div className="ep__actionbar-btns">
            <Link href={backHref} className="an-btn an-btn--secondary an-btn--sm">
              취소
            </Link>
            <button
              type="button"
              className="an-btn an-btn--primary an-btn--sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '등록하기'}
            </button>
          </div>
        </div>
      </div>

      <main className="ep__main">
        <div className="ep__paper press-ep">
          <div className="press-ep__intro">
            <p>
              외부에 게재된 기사를 소개합니다. <strong>원문 URL</strong>과 <strong>게재일</strong>을 정확히 입력해 주세요.
            </p>
          </div>

          <div className="ep__meta-row press-ep__meta-row">
            <label className="an-check">
              <input
                type="checkbox"
                className="an-check__input"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
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
              <span className="an-check__label">목록 상단 대표 노출</span>
            </label>
            <div className="ep__meta-date">
              <span className="ep__meta-date-label">기사 게재일</span>
              <DatePicker value={publishedAt} onChange={setPublishedAt} />
            </div>
            <div className="ep__meta-date">
              <span className="ep__meta-date-label">사이트 등록일</span>
              <DatePicker value={createdAt} onChange={setCreatedAt} />
            </div>
          </div>

          <label className="press-ep__field">
            <span className="press-ep__label">제목</span>
            <input
              type="text"
              className="ep__title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="기사 제목"
              maxLength={200}
            />
          </label>

          <div className="press-ep__grid2">
            <label className="press-ep__field">
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
            <label className="press-ep__field">
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

          <label className="press-ep__field">
            <span className="press-ep__label">목록용 요약 (한 줄)</span>
            <textarea
              className="press-ep__textarea"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="기사 핵심을 1~3문장으로 요약해 주세요."
              rows={3}
              maxLength={500}
            />
          </label>

          <div className="ep-cover press-ep__thumb">
            <span className="ep-cover__label">썸네일 이미지 URL (선택)</span>
            <div className="ep-cover__row">
              <input
                type="url"
                className="ep-cover__input"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://"
              />
              <div className="ep-cover__preview" aria-label="썸네일 미리보기">
                {thumbnailUrl.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnailUrl.trim()} alt="" />
                ) : (
                  <div className="ep-cover__preview-empty" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 17l5-4 3 3 3-2 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="press-ep__body-block">
            <span className="press-ep__label">추가 본문 (선택)</span>
            <div className="press-ep__toolbar" role="toolbar" aria-label="본문 서식">
              <button
                type="button"
                className="press-ep__tb"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                aria-pressed={editor?.isActive('bold')}
              >
                굵게
              </button>
              <button
                type="button"
                className="press-ep__tb"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                aria-pressed={editor?.isActive('bulletList')}
              >
                목록
              </button>
              <button
                type="button"
                className="press-ep__tb"
                onClick={() => {
                  const url = window.prompt('링크 URL');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
              >
                링크
              </button>
            </div>
            <EditorContent editor={editor} className="ep-editor-wrap press-ep__editor-wrap" />
          </div>
        </div>
      </main>
    </div>
  );
}
