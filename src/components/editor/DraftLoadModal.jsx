'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteAdminDraft, listAdminDrafts } from '@/app/admin/drafts/actions';
import { draftDisplayTitle, formatDraftUpdatedAt } from '@/lib/admin-drafts';

/**
 * 임시저장 목록 모달 — 항목 선택 시 onLoad(draftId)
 */
export default function DraftLoadModal({ open, contentType, onClose, onLoad }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listAdminDrafts(contentType);
      setDrafts(list);
    } catch {
      setError('임시저장 목록을 불러오지 못했습니다.');
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  useEffect(() => {
    if (open) fetchDrafts();
  }, [open, fetchDrafts]);

  const handleDelete = async (e, draftId) => {
    e.stopPropagation();
    if (!confirm('이 임시저장을 삭제하시겠습니까?')) return;
    setDeletingId(draftId);
    try {
      await deleteAdminDraft(draftId);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="an-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="an-modal an-modal--sm an-modal--draft-load"
        role="dialog"
        aria-modal="true"
        aria-label="임시저장 불러오기"
      >
        <div className="an-modal__hd">
          <h2 className="an-modal__title">임시저장 불러오기</h2>
          <button type="button" className="an-modal__close" onClick={onClose} aria-label="닫기">
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

        <div className="an-modal__body ep-draft-modal__body">
          {loading && <p className="ep-draft-modal__status">불러오는 중...</p>}
          {!loading && error && (
            <p className="ep-draft-modal__status ep-draft-modal__status--error">{error}</p>
          )}
          {!loading && !error && drafts.length === 0 && (
            <p className="ep-draft-modal__status">저장된 임시글이 없습니다.</p>
          )}
          {!loading && !error && drafts.length > 0 && (
            <ul className="ep-draft-list">
              {drafts.map((draft) => (
                <li key={draft.id} className="ep-draft-list__row">
                  <button
                    type="button"
                    className="ep-draft-list__item"
                    onClick={() => onLoad(draft.id)}
                  >
                    <span className="ep-draft-list__title">{draftDisplayTitle(draft.title)}</span>
                    <span className="ep-draft-list__meta">
                      {formatDraftUpdatedAt(draft.updatedAt)}
                      {draft.sourcePostId ? ` · 게시물 #${draft.sourcePostId} 수정 중` : ''}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="ep-draft-list__delete"
                    onClick={(e) => handleDelete(e, draft.id)}
                    disabled={deletingId === draft.id}
                    aria-label="임시저장 삭제"
                  >
                    {deletingId === draft.id ? '…' : '삭제'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="an-modal__ft">
          <button type="button" className="an-btn an-btn--secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
