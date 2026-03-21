'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { deleteDisclosure } from './actions';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function DisclosuresClient({ initialDisclosures }) {
  const [disclosures, setDisclosures] = useState(initialDisclosures);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deleteDisclosure);

  useEffect(() => { setDisclosures(initialDisclosures); }, [initialDisclosures]);

  const sorted       = [...disclosures].sort((a, b) => b.id - a.id);
  const thisMonth    = new Date().toISOString().slice(0, 7);
  const thisMonthCount = disclosures.filter((d) => d.createdAt?.startsWith(thisMonth)).length;

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">공시자료 관리</h1>
          <p className="an__sub">게시물을 작성·수정·삭제할 수 있습니다.</p>
        </div>
        <Link href="/admin/disclosures/new" className="an-btn an-btn--primary">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 게시물 작성
        </Link>
      </div>

      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{disclosures.length}</span>
          <span className="an-stat__label">전체 게시물</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{thisMonthCount}</span>
          <span className="an-stat__label">이번 달 작성</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">
            {disclosures.reduce((sum, d) => sum + (Number(d.views) || 0), 0).toLocaleString()}
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
            {sorted.map((disclosure, idx) => (
              <tr key={disclosure.id} className="an-table__row">
                <td className="an-table__td an-table__td--num">{sorted.length - idx}</td>
                <td className="an-table__td an-table__td--title">
                  <span className="an-table__notice-title">{disclosure.title}</span>
                </td>
                <td className="an-table__td an-table__td--date">{disclosure.createdAt}</td>
                <td className="an-table__td an-table__td--views">{Number(disclosure.views).toLocaleString()}</td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <Link href={`/admin/disclosures/${disclosure.id}/edit`} className="an-btn an-btn--sm an-btn--ghost">수정</Link>
                    <button className="an-btn an-btn--sm an-btn--danger-ghost" onClick={() => setDeleteTarget(disclosure)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {disclosures.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={5}>
                  게시물이 없습니다.{' '}
                  <Link href="/admin/disclosures/new" className="an-table__empty-link">새 자료를 작성해 보세요.</Link>
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
