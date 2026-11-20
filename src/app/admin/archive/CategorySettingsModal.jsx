'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CATEGORY_NAME_EN_MAX,
  CATEGORY_NAME_MAX,
} from '@/lib/archive-category-shared';
import {
  createArchiveCategory,
  deleteArchiveCategory,
  moveArchiveCategory,
  setArchiveCategoriesEnabled,
  updateArchiveCategory,
} from './category-actions';

export default function CategorySettingsModal({ initialState, onClose, onChange }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(Boolean(initialState?.enabled));
  const [categories, setCategories] = useState(initialState?.categories ?? []);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  async function persist(action, after) {
    setBusy(true);
    setError('');
    try {
      const result = await action();
      if (!result?.ok) {
        setError(result?.error || '저장에 실패했습니다.');
        return;
      }
      setEnabled(result.state.enabled);
      setCategories(result.state.categories);
      onChange(result.state);
      after?.();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  }

  function close() {
    if (busy) return;
    onClose();
  }

  return (
    <div
      className="an-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        className="an-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-category-title"
      >
        <div className="an-modal__hd">
          <h2 className="an-modal__title" id="archive-category-title">카테고리 설정</h2>
          <button type="button" className="an-modal__close" onClick={close} aria-label="닫기">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="an-modal__body">
          <div className="an-cat-toggle">
            <span className="an-field__label" id="archive-category-toggle-label">카테고리 사용</span>
            <button
              type="button"
              className={`an-toggle${enabled ? ' an-toggle--on' : ''}`}
              aria-labelledby="archive-category-toggle-label"
              aria-pressed={enabled}
              disabled={busy}
              onClick={() => {
                void persist(
                  () => setArchiveCategoriesEnabled(!enabled),
                  () => {
                    setPendingDelete(null);
                    setEditingId(null);
                  }
                );
              }}
            >
              <span className="an-toggle__track">
                <span className="an-toggle__thumb" />
              </span>
            </button>
            <span className="an-cat-toggle__state">{enabled ? '켜짐' : '꺼짐'}</span>
          </div>

          {enabled ? (
            <>
              {categories.length === 0 ? (
                <p className="an-field__help">
                  분류를 하나 이상 추가하세요. 분류가 없으면 글을 쓸 때 분류 칸이 나오지 않습니다.
                </p>
              ) : (
                <p className="an-field__help">
                  글을 쓸 때 분류를 고르면 자료실 제목 앞에 말머리로 보입니다. 고르지 않은 글은 말머리 없이 나갑니다.
                </p>
              )}

              {pendingDelete ? (
                <div className="an-cat-confirm">
                  <p className="an-cat-confirm__title">&ldquo;{pendingDelete.name}&rdquo; 분류를 삭제합니다.</p>
                  {pendingDelete.postCount > 0 ? (
                    <p className="an-cat-confirm__warn">
                      이 분류가 붙은 글 {pendingDelete.postCount}개는 말머리 없이 남습니다.
                    </p>
                  ) : (
                    <p className="an-cat-confirm__warn">이 분류를 쓰는 글은 없습니다.</p>
                  )}
                  <div className="an-cat-confirm__actions">
                    <button
                      type="button"
                      className="an-btn an-btn--secondary"
                      disabled={busy}
                      onClick={() => setPendingDelete(null)}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="an-btn an-btn--danger"
                      disabled={busy}
                      onClick={() => {
                        void persist(
                          () => deleteArchiveCategory(pendingDelete.id),
                          () => setPendingDelete(null)
                        );
                      }}
                    >
                      {busy ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {categories.length > 0 ? (
                    <ul className="an-cat-list">
                      {categories.map((category, index) => {
                        const editing = editingId === category.id;
                        return (
                          <li key={category.id} className="an-cat-item">
                            {editing ? (
                              <div className="an-cat-edit">
                                <input
                                  className="an-field__input"
                                  value={editName}
                                  maxLength={CATEGORY_NAME_MAX}
                                  aria-label="분류 이름"
                                  onChange={(event) => setEditName(event.target.value)}
                                />
                                <input
                                  className="an-field__input"
                                  value={editNameEn}
                                  maxLength={CATEGORY_NAME_EN_MAX}
                                  aria-label="영어 이름"
                                  placeholder="영어 이름"
                                  onChange={(event) => setEditNameEn(event.target.value)}
                                />
                                <div className="an-cat-item__actions">
                                  <button
                                    type="button"
                                    className="an-btn an-btn--sm an-btn--primary"
                                    disabled={busy}
                                    onClick={() => {
                                      void persist(
                                        () => updateArchiveCategory(category.id, {
                                          name: editName,
                                          nameEn: editNameEn,
                                        }),
                                        () => setEditingId(null)
                                      );
                                    }}
                                  >
                                    저장
                                  </button>
                                  <button
                                    type="button"
                                    className="an-btn an-btn--sm an-btn--secondary"
                                    disabled={busy}
                                    onClick={() => setEditingId(null)}
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="an-cat-item__text">
                                  <span className="an-cat-item__name">{category.name}</span>
                                  {category.nameEn ? (
                                    <span className="an-cat-item__en">{category.nameEn}</span>
                                  ) : null}
                                </div>
                                <span className="an-cat-item__count">글 {category.postCount}개</span>
                                <div className="an-cat-item__actions">
                                  <button
                                    type="button"
                                    className="an-btn an-btn--sm an-btn--ghost an-btn--icon"
                                    aria-label="위로"
                                    disabled={busy || index === 0}
                                    onClick={() => { void persist(() => moveArchiveCategory(category.id, 'up')); }}
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    className="an-btn an-btn--sm an-btn--ghost an-btn--icon"
                                    aria-label="아래로"
                                    disabled={busy || index === categories.length - 1}
                                    onClick={() => { void persist(() => moveArchiveCategory(category.id, 'down')); }}
                                  >
                                    ↓
                                  </button>
                                  <button
                                    type="button"
                                    className="an-btn an-btn--sm an-btn--ghost"
                                    disabled={busy}
                                    onClick={() => {
                                      setEditingId(category.id);
                                      setEditName(category.name);
                                      setEditNameEn(category.nameEn);
                                      setPendingDelete(null);
                                    }}
                                  >
                                    수정
                                  </button>
                                  <button
                                    type="button"
                                    className="an-btn an-btn--sm an-btn--danger-ghost"
                                    disabled={busy}
                                    onClick={() => {
                                      setEditingId(null);
                                      setPendingDelete(category);
                                    }}
                                  >
                                    삭제
                                  </button>
                                </div>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  <form
                    className="an-cat-add"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void persist(
                        () => createArchiveCategory({ name, nameEn }),
                        () => {
                          setName('');
                          setNameEn('');
                        }
                      );
                    }}
                  >
                    <label className="an-field">
                      <span className="an-field__label">이름</span>
                      <input
                        className="an-field__input"
                        value={name}
                        maxLength={CATEGORY_NAME_MAX}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="예: 보고서"
                      />
                    </label>
                    <label className="an-field">
                      <span className="an-field__label">영어 이름</span>
                      <input
                        className="an-field__input"
                        value={nameEn}
                        maxLength={CATEGORY_NAME_EN_MAX}
                        onChange={(event) => setNameEn(event.target.value)}
                        placeholder="비워 두면 한국어 이름"
                      />
                    </label>
                    <button type="submit" className="an-btn an-btn--primary" disabled={busy}>
                      추가
                    </button>
                  </form>
                </>
              )}
            </>
          ) : (
            <p className="an-field__help">
              꺼 두면 자료실 목록과 글에 분류가 보이지 않습니다. 저장해 둔 분류는 다시 켜면 돌아옵니다.
            </p>
          )}

          {error ? <p className="an-cat-error" role="alert">{error}</p> : null}
        </div>

        <div className="an-modal__ft">
          <button type="button" className="an-btn an-btn--secondary" onClick={close} disabled={busy}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
