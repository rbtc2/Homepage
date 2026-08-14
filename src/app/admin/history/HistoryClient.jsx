'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assertActionOk } from '@/lib/assert-action-ok';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import HistoryFormModal from './HistoryFormModal';
import { createHistoryEvent, updateHistoryEvent, deleteHistoryEvent } from './actions';

function currentYearMonth() {
  const now = new Date();
  return { year: String(now.getFullYear()), month: String(now.getMonth() + 1) };
}

function emptyForm() {
  const { year, month } = currentYearMonth();
  return { year, month, title: '', detail: '' };
}

function formFromEvent(ev) {
  return {
    year: String(ev.year),
    month: String(ev.month),
    title: ev.title ?? '',
    detail: ev.detail ?? '',
  };
}

export default function HistoryClient({ initialEvents }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deleteHistoryEvent);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const yearCount = new Set(events.map((ev) => ev.year)).size;
  const now = new Date();
  const thisMonthCount = events.filter(
    (ev) => ev.year === now.getFullYear() && ev.month === now.getMonth() + 1
  ).length;

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditTarget(ev);
    setForm(formFromEvent(ev));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm());
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        assertActionOk(await updateHistoryEvent(editTarget.id, form));
      } else {
        assertActionOk(await createHistoryEvent(form));
      }
      closeModal();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">연혁 관리</h1>
          <p className="an__sub">사이트 연혁 페이지에 보이는 항목을 추가·수정·삭제합니다.</p>
        </div>
        <button type="button" className="an-btn an-btn--primary" onClick={openCreate}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          연혁 추가
        </button>
      </div>

      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{events.length}</span>
          <span className="an-stat__label">전체 항목</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{yearCount}</span>
          <span className="an-stat__label">연도</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{thisMonthCount}</span>
          <span className="an-stat__label">이번 달</span>
        </div>
      </div>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th an-table__th--date">연도</th>
              <th className="an-table__th an-table__th--date">월</th>
              <th className="an-table__th an-table__th--title">내용</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, idx) => (
              <tr key={ev.id} className="an-table__row">
                <td className="an-table__td an-table__td--num">{events.length - idx}</td>
                <td className="an-table__td an-table__td--date" data-label="연도">
                  {ev.year}
                </td>
                <td className="an-table__td an-table__td--date" data-label="월">
                  {ev.month}월
                </td>
                <td className="an-table__td an-table__td--title">
                  <span className="an-table__notice-title">{ev.title}</span>
                  {ev.detail ? <p className="an-table__sub">{ev.detail}</p> : null}
                </td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <button
                      type="button"
                      className="an-btn an-btn--sm an-btn--ghost"
                      onClick={() => openEdit(ev)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="an-btn an-btn--sm an-btn--danger-ghost"
                      onClick={() => setDeleteTarget(ev)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 ? (
              <tr>
                <td className="an-table__empty" colSpan={5}>
                  등록된 연혁이 없습니다.{' '}
                  <button
                    type="button"
                    className="an-table__empty-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                    onClick={openCreate}
                  >
                    첫 항목을 추가해 보세요.
                  </button>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <HistoryFormModal
          editTarget={editTarget}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          saving={saving}
        />
      ) : null}

      <DeleteConfirmModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
