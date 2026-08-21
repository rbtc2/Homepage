'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assertActionOk } from '@/lib/assert-action-ok';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import HistoryFormModal from './HistoryFormModal';
import {
  createHistoryEvent,
  updateHistoryEvent,
  deleteHistoryEvent,
  clearHistoryEnglish,
} from './actions';

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
  const [clearingId, setClearingId] = useState(null);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deleteHistoryEvent);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  async function handleClearEnglish(ev) {
    const ok = window.confirm(
      `「${ev.title}」의 영문 내용·부가 설명을 삭제할까요?\n한국어 항목은 그대로 두고, 영문 사이트에는 한국어가 다시 보입니다.`
    );
    if (!ok) return;

    setClearingId(ev.id);
    try {
      assertActionOk(await clearHistoryEnglish(ev.id));
      setEvents((curr) =>
        curr.map((row) =>
          row.id === ev.id
            ? { ...row, hasEnglish: false, titleEn: '', detailEn: '' }
            : row
        )
      );
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : '영문 삭제에 실패했습니다. 다시 시도해 주세요.';
      alert(msg);
    } finally {
      setClearingId(null);
    }
  }

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
    <>
      <div className="an__bar">
        <div className="an-stats" style={{ marginBottom: 0 }}>
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
        <button type="button" className="an-btn an-btn--primary" onClick={openCreate}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          연혁 추가
        </button>
      </div>

      <div className="an-table-wrap an-table-wrap--history">
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
                  <span className="an-table__title-row">
                    <span className="an-table__notice-title">{ev.title}</span>
                    {ev.hasEnglish ? (
                      <span className="an-en-badge-wrap">
                        <Link
                          href={`/admin/settings/history/${ev.id}/en`}
                          className="an-en-badge"
                          title="영문 수정"
                        >
                          EN
                        </Link>
                        <button
                          type="button"
                          className="an-en-badge-clear"
                          aria-label="영문 삭제"
                          title="영문 삭제"
                          disabled={clearingId === ev.id}
                          onClick={() => handleClearEnglish(ev)}
                        >
                          {clearingId === ev.id ? '…' : '×'}
                        </button>
                      </span>
                    ) : (
                      <Link
                        href={`/admin/settings/history/${ev.id}/en`}
                        className="an-en-badge an-en-badge--add"
                        title="영문 작성"
                      >
                        +EN
                      </Link>
                    )}
                  </span>
                  {ev.detail ? <p className="an-table__sub">{ev.detail}</p> : null}
                </td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <Link
                      href="/history"
                      className="an-btn an-btn--sm an-btn--ghost an-btn--icon"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="새 탭에서 보기"
                      title="보기"
                    >
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M8 2h4v4M12 2L6.5 7.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 8.2V11a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h2.8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
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
    </>
  );
}
