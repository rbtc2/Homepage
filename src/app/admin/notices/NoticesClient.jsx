'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createNotice, updateNotice, deleteNotice, togglePin } from './actions';

const EMPTY_FORM = { title: '', content: '', isPinned: false };

export default function NoticesClient({ initialNotices }) {
  const router = useRouter();
  const [notices, setNotices] = useState(initialNotices);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const titleRef = useRef(null);

  useEffect(() => {
    setNotices(initialNotices);
  }, [initialNotices]);

  useEffect(() => {
    if (formOpen) {
      const t = setTimeout(() => titleRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [formOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (formOpen) setFormOpen(false);
        if (deleteTarget) setDeleteTarget(null);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [formOpen, deleteTarget]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (notice) => {
    setEditTarget(notice);
    setForm({ title: notice.title, content: notice.content, isPinned: notice.isPinned });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        await updateNotice(editTarget.id, form);
      } else {
        await createNotice(form);
      }
      setFormOpen(false);
      router.refresh();
    } catch {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteNotice(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch {
      alert('삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePin = async (notice) => {
    setTogglingId(notice.id);
    try {
      await togglePin(notice.id);
      router.refresh();
    } catch {
      alert('공지 설정에 실패했습니다.');
    } finally {
      setTogglingId(null);
    }
  };

  const sorted = [...notices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.id - a.id;
  });

  const nonPinnedSorted = sorted.filter((n) => !n.isPinned);
  const totalNonPinned = nonPinnedSorted.length;
  const getRowNum = (notice) => {
    if (notice.isPinned) return null;
    const idx = nonPinnedSorted.findIndex((n) => n.id === notice.id);
    return totalNonPinned - idx;
  };

  const pinnedCount = notices.filter((n) => n.isPinned).length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCount = notices.filter((n) => n.createdAt.startsWith(thisMonth)).length;
  const isFormValid = form.title.trim().length > 0 && form.content.trim().length > 0;

  return (
    <div className="an">
      {/* 페이지 헤더 */}
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">공지사항 관리</h1>
          <p className="an__sub">게시물을 작성·수정·삭제하거나 공지로 고정할 수 있습니다.</p>
        </div>
        <button className="an-btn an-btn--primary" onClick={openCreate}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 게시물 작성
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{notices.length}</span>
          <span className="an-stat__label">전체 게시물</span>
        </div>
        <div className="an-stat an-stat--pin">
          <span className="an-stat__num">{pinnedCount}</span>
          <span className="an-stat__label">공지 고정</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{thisMonthCount}</span>
          <span className="an-stat__label">이번 달 작성</span>
        </div>
      </div>

      {/* 목록 테이블 */}
      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th an-table__th--pin">공지</th>
              <th className="an-table__th an-table__th--title">제목</th>
              <th className="an-table__th an-table__th--date">작성일</th>
              <th className="an-table__th an-table__th--views">조회</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((notice) => (
              <tr
                key={notice.id}
                className={`an-table__row${notice.isPinned ? ' an-table__row--pinned' : ''}`}
              >
                <td className="an-table__td an-table__td--num">
                  {notice.isPinned ? (
                    <span className="an-pin-badge">공지</span>
                  ) : (
                    getRowNum(notice)
                  )}
                </td>
                <td className="an-table__td an-table__td--pin">
                  <button
                    className={`an-star-btn${notice.isPinned ? ' an-star-btn--on' : ''}`}
                    onClick={() => handleTogglePin(notice)}
                    disabled={togglingId === notice.id}
                    title={notice.isPinned ? '공지 해제' : '공지로 고정'}
                    aria-label={notice.isPinned ? '공지 해제' : '공지로 고정'}
                    aria-pressed={notice.isPinned}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill={notice.isPinned ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </td>
                <td className="an-table__td an-table__td--title">
                  <span className="an-table__notice-title">{notice.title}</span>
                </td>
                <td className="an-table__td an-table__td--date">{notice.createdAt}</td>
                <td className="an-table__td an-table__td--views">{notice.views.toLocaleString()}</td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <button
                      className="an-btn an-btn--sm an-btn--ghost"
                      onClick={() => openEdit(notice)}
                    >
                      수정
                    </button>
                    <button
                      className="an-btn an-btn--sm an-btn--danger-ghost"
                      onClick={() => setDeleteTarget(notice)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={6}>
                  게시물이 없습니다. 새 게시물을 작성해 보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 작성/수정 모달 */}
      {formOpen && (
        <div
          className="an-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFormOpen(false);
          }}
        >
          <div
            className="an-modal"
            role="dialog"
            aria-modal="true"
            aria-label={editTarget ? '게시물 수정' : '새 게시물 작성'}
          >
            <div className="an-modal__hd">
              <h2 className="an-modal__title">
                {editTarget ? '게시물 수정' : '새 게시물 작성'}
              </h2>
              <button
                className="an-modal__close"
                onClick={() => setFormOpen(false)}
                aria-label="닫기"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M2 2l12 12M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="an-modal__body">
              <div className="an-field">
                <label className="an-field__label" htmlFor="an-form-title">
                  제목
                  <span className="an-field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="an-form-title"
                  ref={titleRef}
                  type="text"
                  className="an-field__input"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="게시물 제목을 입력하세요"
                  maxLength={100}
                />
                <span className="an-field__counter">{form.title.length} / 100</span>
              </div>

              <div className="an-field">
                <label className="an-field__label" htmlFor="an-form-content">
                  내용
                  <span className="an-field__req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="an-form-content"
                  className="an-field__textarea"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="게시물 내용을 입력하세요"
                  rows={10}
                />
              </div>

              <label className="an-check">
                <input
                  type="checkbox"
                  className="an-check__input"
                  checked={form.isPinned}
                  onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                />
                <span className="an-check__box" aria-hidden="true">
                  <svg
                    className="an-check__mark"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 5l2.5 2.5L8.5 2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="an-check__label">공지로 고정 (목록 상단에 고정됩니다)</span>
              </label>
            </div>

            <div className="an-modal__ft">
              <button className="an-btn an-btn--secondary" onClick={() => setFormOpen(false)}>
                취소
              </button>
              <button
                className="an-btn an-btn--primary"
                onClick={handleSave}
                disabled={!isFormValid || saving}
              >
                {saving ? '저장 중…' : editTarget ? '수정 완료' : '게시물 등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          className="an-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div
            className="an-modal an-modal--sm"
            role="dialog"
            aria-modal="true"
            aria-label="게시물 삭제 확인"
          >
            <div className="an-modal__hd">
              <h2 className="an-modal__title">게시물 삭제</h2>
              <button
                className="an-modal__close"
                onClick={() => setDeleteTarget(null)}
                aria-label="닫기"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M2 2l12 12M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="an-modal__body">
              <div className="an-del-confirm">
                <div className="an-del-confirm__icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="an-del-confirm__q">이 게시물을 삭제하시겠습니까?</p>
                <p className="an-del-confirm__title">&ldquo;{deleteTarget.title}&rdquo;</p>
                <p className="an-del-confirm__warn">삭제된 게시물은 복구할 수 없습니다.</p>
              </div>
            </div>

            <div className="an-modal__ft">
              <button className="an-btn an-btn--secondary" onClick={() => setDeleteTarget(null)}>
                취소
              </button>
              <button
                className="an-btn an-btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
