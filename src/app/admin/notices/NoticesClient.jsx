'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteNotice, togglePin } from './actions';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function NoticesClient({ initialNotices }) {
  const router = useRouter();
  const [notices,    setNotices]    = useState(initialNotices);
  const [togglingId, setTogglingId] = useState(null);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deleteNotice);

  useEffect(() => { setNotices(initialNotices); }, [initialNotices]);

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
  const totalNonPinned  = nonPinnedSorted.length;
  const getRowNum = (notice) => {
    if (notice.isPinned) return null;
    const idx = nonPinnedSorted.findIndex((n) => n.id === notice.id);
    return totalNonPinned - idx;
  };

  const pinnedCount  = notices.filter((n) => n.isPinned).length;
  const thisMonth    = new Date().toISOString().slice(0, 7);
  const thisMonthCount = notices.filter((n) => n.createdAt.startsWith(thisMonth)).length;

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">공지사항 관리</h1>
          <p className="an__sub">게시물을 작성·수정·삭제하거나 공지로 고정할 수 있습니다.</p>
        </div>
        <Link href="/admin/notices/new" className="an-btn an-btn--primary">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 게시물 작성
        </Link>
      </div>

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
                  {notice.isPinned
                    ? <span className="an-pin-badge">공지</span>
                    : getRowNum(notice)}
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={notice.isPinned ? 'currentColor' : 'none'} aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
                    <Link href={`/admin/notices/${notice.id}/edit`} className="an-btn an-btn--sm an-btn--ghost">수정</Link>
                    <button className="an-btn an-btn--sm an-btn--danger-ghost" onClick={() => setDeleteTarget(notice)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={6}>
                  게시물이 없습니다.{' '}
                  <Link href="/admin/notices/new" className="an-table__empty-link">새 게시물을 작성해 보세요.</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
