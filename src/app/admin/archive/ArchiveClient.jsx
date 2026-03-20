'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { deleteArchive } from './actions';

export default function ArchiveClient({ initialArchives }) {
  const router = useRouter();
  const [archives, setArchives] = useState(initialArchives);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setArchives(initialArchives);
  }, [initialArchives]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && deleteTarget) setDeleteTarget(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [deleteTarget]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteArchive(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch {
      alert('삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setDeleting(false);
    }
  };

  const sorted = [...archives].sort((a, b) => b.id - a.id);
  const thisMonth = new Date().toISOString().slice(0, 7);
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
                <td className="an-table__td an-table__td--views">
                  {Number(archive.views).toLocaleString()}
                </td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <Link
                      href={`/admin/archive/${archive.id}/edit`}
                      className="an-btn an-btn--sm an-btn--ghost"
                    >
                      수정
                    </Link>
                    <button
                      className="an-btn an-btn--sm an-btn--danger-ghost"
                      onClick={() => setDeleteTarget(archive)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {archives.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={5}>
                  게시물이 없습니다.{' '}
                  <Link href="/admin/archive/new" className="an-table__empty-link">
                    새 자료를 작성해 보세요.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div
          className="an-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="an-modal an-modal--sm" role="dialog" aria-modal="true" aria-label="게시물 삭제 확인">
            <div className="an-modal__hd">
              <h2 className="an-modal__title">게시물 삭제</h2>
              <button className="an-modal__close" onClick={() => setDeleteTarget(null)} aria-label="닫기">
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
              <button className="an-btn an-btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

