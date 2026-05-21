'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PopupFormModal from './PopupFormModal';
import { createPopup, updatePopup, deletePopup, togglePopupActive } from './actions';
import {
  defaultKstDatetimeLocal,
  formatPopupPeriod,
  getPopupStatus,
  isoToKstDatetimeLocal,
} from '@/lib/popup-schedule';

const POSITION_LABELS = {
  center: '중앙',
  'top-left': '좌상단',
  'top-right': '우상단',
  'bottom-left': '좌하단',
  'bottom-right': '우하단',
};

const STATUS_LABEL = {
  active: '노출 중',
  inactive: '비활성',
  scheduled: '예약 대기',
  expired: '기간 만료',
};

const EMPTY_FORM = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  displayMode: 'immediate',
  isActive: false,
  startAt: defaultKstDatetimeLocal(0),
  endAt: defaultKstDatetimeLocal(60 * 24 * 7),
  position: 'center',
  widthPx: '',
  heightPx: '',
  offsetX: 0,
  offsetY: 0,
  showCloseForDay: true,
};

function formFromPopup(popup) {
  return {
    title: popup.title,
    imageUrl: popup.imageUrl,
    linkUrl: popup.linkUrl,
    displayMode: popup.displayMode,
    isActive: popup.isActive,
    startAt: popup.startAt ? isoToKstDatetimeLocal(popup.startAt) : defaultKstDatetimeLocal(0),
    endAt: popup.endAt ? isoToKstDatetimeLocal(popup.endAt) : defaultKstDatetimeLocal(60 * 24 * 7),
    position: popup.position,
    widthPx: popup.widthPx ?? '',
    heightPx: popup.heightPx ?? '',
    offsetX: popup.offsetX ?? 0,
    offsetY: popup.offsetY ?? 0,
    showCloseForDay: popup.showCloseForDay,
  };
}

export default function PopupsClient({ initialPopups }) {
  const router = useRouter();
  const [popups, setPopups] = useState(initialPopups);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setPopups(initialPopups);
  }, [initialPopups]);

  const activeCount = popups.filter((p) => getPopupStatus(p) === 'active').length;
  const scheduledCount = popups.filter((p) => getPopupStatus(p) === 'scheduled').length;

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (popup) => {
    setEditTarget(popup);
    setForm(formFromPopup(popup));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDisplayModeChange = (mode) => {
    setForm((prev) => ({
      ...prev,
      displayMode: mode,
      ...(mode === 'scheduled' && !prev.startAt
        ? {
            startAt: defaultKstDatetimeLocal(0),
            endAt: defaultKstDatetimeLocal(60 * 24 * 7),
            isActive: true,
          }
        : null),
    }));
  };

  const handleImageUrlChange = (url) => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await updatePopup(editTarget.id, form);
      } else {
        await createPopup(form);
      }
      closeModal();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (popup) => {
    setTogglingId(popup.id);
    try {
      await togglePopupActive(popup.id);
      router.refresh();
    } catch {
      alert('활성화 상태 변경에 실패했습니다.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePopup(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">팝업 관리</h1>
          <p className="an__sub">
            즉시 노출은 켜기·끄기로 제어하고, 기간 예약은 KST 기준 시각에 맞춰 자동으로 노출됩니다.
          </p>
        </div>
        <button type="button" className="an-btn an-btn--primary" onClick={openCreate}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 팝업 등록
        </button>
      </div>

      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{popups.length}</span>
          <span className="an-stat__label">전체 팝업</span>
        </div>
        <div className="an-stat an-stat--active">
          <span className="an-stat__num">{activeCount}</span>
          <span className="an-stat__label">노출 중</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{scheduledCount}</span>
          <span className="an-stat__label">예약 대기</span>
        </div>
      </div>

      <div className="an-table-wrap an-table-wrap--popup">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th an-table__th--title">팝업 제목</th>
              <th className="an-table__th an-table__th--popup-period">노출 설정</th>
              <th className="an-table__th an-table__th--popup-pos">위치</th>
              <th className="an-table__th an-table__th--popup-status">상태</th>
              <th className="an-table__th an-table__th--popup-active">활성화</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {popups.map((popup, idx) => {
              const status = getPopupStatus(popup);
              const toggleLabel =
                popup.displayMode === 'immediate'
                  ? popup.isActive
                    ? '즉시 노출 끄기'
                    : '즉시 노출 켜기'
                  : popup.isActive
                    ? '예약 비활성화'
                    : '예약 활성화';

              return (
                <tr key={popup.id} className="an-table__row">
                  <td className="an-table__td an-table__td--num">{popups.length - idx}</td>
                  <td className="an-table__td an-table__td--title">
                    <span className="an-table__notice-title">{popup.title}</span>
                  </td>
                  <td className="an-table__td an-table__td--date" data-label="노출 설정">
                    <span className="an-popup-period">{formatPopupPeriod(popup)}</span>
                  </td>
                  <td className="an-table__td an-table__td--date" data-label="위치">
                    {POSITION_LABELS[popup.position] ?? popup.position}
                  </td>
                  <td className="an-table__td" data-label="상태">
                    <span className={`an-status-badge an-status-badge--${status}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </td>
                  <td className="an-table__td an-table__td--popup-active" data-label="활성화">
                    <button
                      type="button"
                      className={`an-toggle${popup.isActive ? ' an-toggle--on' : ''}`}
                      onClick={() => handleToggleActive(popup)}
                      disabled={togglingId === popup.id}
                      aria-label={toggleLabel}
                      aria-pressed={popup.isActive}
                      title={toggleLabel}
                    >
                      <span className="an-toggle__track">
                        <span className="an-toggle__thumb" />
                      </span>
                    </button>
                  </td>
                  <td className="an-table__td an-table__td--actions">
                    <div className="an-actions">
                      <button
                        type="button"
                        className="an-btn an-btn--sm an-btn--ghost"
                        onClick={() => openEdit(popup)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="an-btn an-btn--sm an-btn--danger-ghost"
                        onClick={() => setDeleteTarget(popup)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {popups.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={7}>
                  등록된 팝업이 없습니다.{' '}
                  <button
                    type="button"
                    className="an-table__empty-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                    onClick={openCreate}
                  >
                    새 팝업을 등록해 보세요.
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <PopupFormModal
          editTarget={editTarget}
          form={form}
          onChange={handleFormChange}
          onDisplayModeChange={handleDisplayModeChange}
          onImageUrlChange={handleImageUrlChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <div
          className="an-overlay"
          onClick={(e) => e.target === e.currentTarget && !deleting && setDeleteTarget(null)}
        >
          <div className="an-modal an-modal--sm" role="dialog" aria-modal="true">
            <div className="an-modal__hd">
              <h2 className="an-modal__title">팝업 삭제</h2>
              <button
                type="button"
                className="an-modal__close"
                onClick={() => setDeleteTarget(null)}
                aria-label="닫기"
                disabled={deleting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="an-modal__body">
              <div className="an-del-confirm">
                <div className="an-del-confirm__icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="an-del-confirm__q">이 팝업을 삭제할까요?</p>
                <p className="an-del-confirm__title">{deleteTarget.title}</p>
                <p className="an-del-confirm__warn">삭제 후에는 복구할 수 없습니다.</p>
              </div>
            </div>
            <div className="an-modal__ft">
              <button
                type="button"
                className="an-btn an-btn--secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                취소
              </button>
              <button
                type="button"
                className="an-btn an-btn--danger"
                onClick={handleDeleteConfirm}
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
