'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { deleteArchive } from './actions';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function ArchiveClient({ initialArchives }) {
  const [archives, setArchives] = useState(initialArchives);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deleteArchive);

  useEffect(() => { setArchives(initialArchives); }, [initialArchives]);

  const sorted       = [...archives].sort((a, b) => b.id - a.id);
  const thisMonth    = new Date().toISOString().slice(0, 7);
  const thisMonthCount = archives.filter((a) => a.createdAt?.startsWith(thisMonth)).length;

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">자료실 관리</h1>
          <p className="an__sub">게시물을 작성·수정·삭제할 수 있습니다.</p>
        </div>
        <Link href="/admin/archive/new" className="an-btn an-btn--primary">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 자료 작성
        </Link>
      </div>

      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{archives.length}</span>
          <span className="an-stat__label">전체 게시물</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{thisMonthCount}</span>
          <span className="an-stat__label">이번 달 작성</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">
            {archives.reduce((sum, a) => sum + (Number(a.views) || 0), 0).toLocaleString()}
          </span>
          <span className="an-stat__label">누적 조회</span>
        </div>
      </div>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th an-table__th--title">제목</th>
              <th className="an-table__th an-table__th--date">작성일</th>
              <th className="an-table__th an-table__th--views">조회</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((archive, idx) => (
              <tr key={archive.id} className="an-table__row">
                <td className="an-table__td an-table__td--num">{sorted.length - idx}</td>
                <td className="an-table__td an-table__td--title">
                  <span className="an-table__notice-title">{archive.title}</span>
                </td>
                <td className="an-table__td an-table__td--date">{archive.createdAt}</td>
                <td className="an-table__td an-table__td--views">{Number(archive.views).toLocaleString()}</td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <Link href={`/admin/archive/${archive.id}/edit`} className="an-btn an-btn--sm an-btn--ghost">수정</Link>
                    <button className="an-btn an-btn--sm an-btn--danger-ghost" onClick={() => setDeleteTarget(archive)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {archives.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={5}>
                  게시물이 없습니다.{' '}
                  <Link href="/admin/archive/new" className="an-table__empty-link">새 자료를 작성해 보세요.</Link>
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
