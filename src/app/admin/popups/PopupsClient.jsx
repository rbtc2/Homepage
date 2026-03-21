'use client';

import { useState } from 'react';

const POSITION_LABELS = {
  center: '중앙',
  'bottom-left': '좌하단',
  'bottom-right': '우하단',
};

const POSITION_OPTIONS = [
  { value: 'center', label: '중앙' },
  { value: 'bottom-left', label: '좌하단' },
  { value: 'bottom-right', label: '우하단' },
];

function getStatus(popup) {
  const today = new Date().toISOString().slice(0, 10);
  if (!popup.isActive) return 'inactive';
  if (popup.startDate > today) return 'scheduled';
  if (popup.endDate < today) return 'expired';
  return 'active';
}

const STATUS_LABEL = {
  active: '노출 중',
  inactive: '비활성',
  scheduled: '예약됨',
  expired: '기간 만료',
};

const EMPTY_FORM = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  startDate: '',
  endDate: '',
  position: 'center',
  showCloseForDay: true,
  isActive: false,
};

export default function PopupsClient({ initialPopups }) {
  const [popups, setPopups] = useState(initialPopups);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeCount    = popups.filter((p) => getStatus(p) === 'active').length;
  const scheduledCount = popups.filter((p) => getStatus(p) === 'scheduled').length;

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (popup) => {
    setEditTarget(popup);
    setForm({
      title: popup.title,
      imageUrl: popup.imageUrl,
      linkUrl: popup.linkUrl,
      startDate: popup.startDate,
      endDate: popup.endDate,
      position: popup.position,
      showCloseForDay: popup.showCloseForDay,
      isActive: popup.isActive,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: createPopup / updatePopup Server Action 연결
    alert('아직 구현되지 않은 기능입니다.');
    closeModal();
  };

  const handleToggleActive = (popup) => {
    // TODO: togglePopupActive Server Action 연결
    setPopups((prev) =>
      prev.map((p) => (p.id === popup.id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDeleteConfirm = () => {
    // TODO: deletePopup Server Action 연결
    setPopups((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="an">
      {/* 페이지 헤더 */}
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">팝업 관리</h1>
          <p className="an__sub">홈페이지에 노출할 팝업을 등록·수정·삭제하거나 활성화할 수 있습니다.</p>
        </div>
        <button className="an-btn an-btn--primary" onClick={openCreate}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 팝업 등록
        </button>
      </div>

      {/* 통계 */}
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
          <span className="an-stat__label">예약됨</span>
        </div>
      </div>

      {/* 팝업 목록 테이블 */}
      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th an-table__th--title">팝업 제목</th>
              <th className="an-table__th an-table__th--popup-period">노출 기간</th>
              <th className="an-table__th an-table__th--popup-pos">위치</th>
              <th className="an-table__th an-table__th--popup-status">상태</th>
              <th className="an-table__th an-table__th--popup-active">활성화</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {popups.map((popup, idx) => {
              const status = getStatus(popup);
              return (
                <tr key={popup.id} className="an-table__row">
                  <td className="an-table__td an-table__td--num">{popups.length - idx}</td>
                  <td className="an-table__td an-table__td--title">
                    <span className="an-table__notice-title">{popup.title}</span>
                  </td>
                  <td className="an-table__td an-table__td--date">
                    <span className="an-popup-period">
                      {popup.startDate} ~ {popup.endDate}
                    </span>
                  </td>
                  <td className="an-table__td an-table__td--date">
                    {POSITION_LABELS[popup.position] ?? popup.position}
                  </td>
                  <td className="an-table__td">
                    <span className={`an-status-badge an-status-badge--${status}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </td>
                  <td className="an-table__td an-table__td--popup-active">
                    <button
                      className={`an-toggle${popup.isActive ? ' an-toggle--on' : ''}`}
                      onClick={() => handleToggleActive(popup)}
                      aria-label={popup.isActive ? '팝업 비활성화' : '팝업 활성화'}
                      aria-pressed={popup.isActive}
                      title={popup.isActive ? '클릭하여 비활성화' : '클릭하여 활성화'}
                    >
                      <span className="an-toggle__track">
                        <span className="an-toggle__thumb" />
                      </span>
                    </button>
                  </td>
                  <td className="an-table__td an-table__td--actions">
                    <div className="an-actions">
                      <button
                        className="an-btn an-btn--sm an-btn--ghost"
                        onClick={() => openEdit(popup)}
                      >
                        수정
                      </button>
                      <button
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

      {/* 팝업 등록·수정 모달 */}
      {modalOpen && (
        <div className="an-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="an-modal an-modal--popup-form" role="dialog" aria-modal="true">
            <div className="an-modal__hd">
              <h2 className="an-modal__title">
                {editTarget ? '팝업 수정' : '새 팝업 등록'}
              </h2>
              <button className="an-modal__close" onClick={closeModal} aria-label="닫기">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="an-modal__body">
                {/* 팝업 제목 */}
                <div className="an-field">
                  <label className="an-field__label" htmlFor="popup-title">
                    팝업 제목 <span className="an-field__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="popup-title"
                    name="title"
                    type="text"
                    className="an-field__input"
                    placeholder="관리용 제목을 입력하세요 (사용자에게 노출되지 않음)"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                {/* 이미지 URL */}
                <div className="an-field">
                  <label className="an-field__label" htmlFor="popup-image">이미지 URL</label>
                  <input
                    id="popup-image"
                    name="imageUrl"
                    type="url"
                    className="an-field__input"
                    placeholder="https://example.com/image.png"
                    value={form.imageUrl}
                    onChange={handleFormChange}
                  />
                </div>

                {/* 링크 URL */}
                <div className="an-field">
                  <label className="an-field__label" htmlFor="popup-link">클릭 시 이동 URL</label>
                  <input
                    id="popup-link"
                    name="linkUrl"
                    type="text"
                    className="an-field__input"
                    placeholder="/notices/1 또는 https://..."
                    value={form.linkUrl}
                    onChange={handleFormChange}
                  />
                </div>

                {/* 노출 기간 */}
                <div className="an-field-row">
                  <div className="an-field">
                    <label className="an-field__label" htmlFor="popup-start">
                      노출 시작일 <span className="an-field__req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="popup-start"
                      name="startDate"
                      type="date"
                      className="an-field__input"
                      value={form.startDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="an-field">
                    <label className="an-field__label" htmlFor="popup-end">
                      노출 종료일 <span className="an-field__req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="popup-end"
                      name="endDate"
                      type="date"
                      className="an-field__input"
                      value={form.endDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                {/* 팝업 위치 */}
                <div className="an-field">
                  <label className="an-field__label" htmlFor="popup-position">팝업 위치</label>
                  <select
                    id="popup-position"
                    name="position"
                    className="an-field__input an-field__select"
                    value={form.position}
                    onChange={handleFormChange}
                  >
                    {POSITION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 옵션 */}
                <div className="an-field-checks">
                  <label className="an-check">
                    <input
                      type="checkbox"
                      name="showCloseForDay"
                      className="an-check__input"
                      checked={form.showCloseForDay}
                      onChange={handleFormChange}
                    />
                    <span className="an-check__box" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="an-check__label">오늘 하루 보지 않기 버튼 표시</span>
                  </label>
                  <label className="an-check">
                    <input
                      type="checkbox"
                      name="isActive"
                      className="an-check__input"
                      checked={form.isActive}
                      onChange={handleFormChange}
                    />
                    <span className="an-check__box" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="an-check__label">즉시 활성화</span>
                  </label>
                </div>
              </div>

              <div className="an-modal__ft">
                <button type="button" className="an-btn an-btn--secondary" onClick={closeModal}>
                  취소
                </button>
                <button type="submit" className="an-btn an-btn--primary">
                  {editTarget ? '수정 저장' : '팝업 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          className="an-overlay"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="an-modal an-modal--sm" role="dialog" aria-modal="true">
            <div className="an-modal__hd">
              <h2 className="an-modal__title">팝업 삭제</h2>
              <button className="an-modal__close" onClick={() => setDeleteTarget(null)} aria-label="닫기">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="an-modal__body">
              <div className="an-del-confirm">
                <div className="an-del-confirm__icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="an-del-confirm__q">이 팝업을 삭제할까요?</p>
                <p className="an-del-confirm__title">{deleteTarget.title}</p>
                <p className="an-del-confirm__warn">삭제 후에는 복구할 수 없습니다.</p>
              </div>
            </div>
            <div className="an-modal__ft">
              <button className="an-btn an-btn--secondary" onClick={() => setDeleteTarget(null)}>
                취소
              </button>
              <button className="an-btn an-btn--danger" onClick={handleDeleteConfirm}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
