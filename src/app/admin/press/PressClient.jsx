'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePress, togglePressFeatured } from './actions';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function PressClient({ initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [togglingId, setTogglingId] = useState(null);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deletePress);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleToggleFeatured = async (row) => {
    setTogglingId(row.id);
    try {
      await togglePressFeatured(row.id);
      router.refresh();
    } catch {
      alert('대표 설정에 실패했습니다.');
    } finally {
      setTogglingId(null);
    }
  };

  const sorted = [...items].sort((a, b) => {
    const da = `${a.publishedAt}T${String(a.id).padStart(8, '0')}`;
    const db = `${b.publishedAt}T${String(b.id).padStart(8, '0')}`;
    return db.localeCompare(da);
  });

  const featuredCount = items.filter((n) => n.isFeatured).length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCount = items.filter((n) => n.createdAt?.startsWith(thisMonth)).length;

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">언론보도 관리</h1>
          <p className="an__sub">외부 기사 URL·언론사·게재일을 등록하고, 목록에는 카드 형태로 노출됩니다.</p>
        </div>
        <Link href="/admin/press/new" className="an-btn an-btn--primary">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 보도 등록
        </Link>
      </div>

      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{items.length}</span>
          <span className="an-stat__label">전체 보도</span>
        </div>
        <div className="an-stat an-stat--pin">
          <span className="an-stat__num">{featuredCount}</span>
          <span className="an-stat__label">대표 노출</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{thisMonthCount}</span>
          <span className="an-stat__label">이번 달 등록</span>
        </div>
      </div>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th an-table__th--pin">대표</th>
              <th className="an-table__th an-table__th--title">제목</th>
              <th className="an-table__th">언론사</th>
              <th className="an-table__th an-table__th--date">게재일</th>
              <th className="an-table__th an-table__th--views">조회</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr
                key={row.id}
                className={`an-table__row${row.isFeatured ? ' an-table__row--pinned' : ''}`}
              >
                <td className="an-table__td an-table__td--num">{sorted.length - idx}</td>
                <td className="an-table__td an-table__td--pin">
                  <button
                    type="button"
                    className={`an-star-btn${row.isFeatured ? ' an-star-btn--on' : ''}`}
                    onClick={() => handleToggleFeatured(row)}
                    disabled={togglingId === row.id}
                    title={row.isFeatured ? '대표 해제' : '목록 상단 대표'}
                    aria-label={row.isFeatured ? '대표 해제' : '목록 상단 대표'}
                    aria-pressed={row.isFeatured}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={row.isFeatured ? 'currentColor' : 'none'} aria-hidden="true">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </td>
                <td className="an-table__td an-table__td--title">
                  <span className="an-table__notice-title">{row.title}</span>
                </td>
                <td className="an-table__td">{row.sourceName}</td>
                <td className="an-table__td an-table__td--date">{row.publishedAt}</td>
                <td className="an-table__td an-table__td--views">
                  {Number(row.views ?? 0).toLocaleString()}
                </td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <Link href={`/admin/press/${row.id}/edit`} className="an-btn an-btn--sm an-btn--ghost">
                      수정
                    </Link>
                    <button
                      type="button"
                      className="an-btn an-btn--sm an-btn--danger-ghost"
                      onClick={() => setDeleteTarget(row)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={7}>
                  등록된 보도가 없습니다.{' '}
                  <Link href="/admin/press/new" className="an-table__empty-link">
                    새 보도를 등록해 보세요.
                  </Link>
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
