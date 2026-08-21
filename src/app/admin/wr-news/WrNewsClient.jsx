'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteWrNewsPost, clearWrNewsEnglish } from './actions';
import { useDelete } from '@/hooks/useDelete';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { assertActionOk } from '@/lib/assert-action-ok';

export default function WrNewsClient({ initialPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [clearingId, setClearingId] = useState(null);

  const { deleteTarget, setDeleteTarget, deleting, handleDelete } = useDelete(deleteWrNewsPost);

  async function handleClearEnglish(post) {
    const ok = window.confirm(
      `「${post.title}」의 영문 제목·본문을 삭제할까요?\n한국어 글은 그대로 두고, 영문 사이트에는 한국어가 다시 보입니다.`
    );
    if (!ok) return;

    setClearingId(post.id);
    try {
      assertActionOk(await clearWrNewsEnglish(post.id));
      setPosts((curr) =>
        curr.map((row) =>
          row.id === post.id
            ? { ...row, hasEnglish: false, titleEn: '', contentEn: '' }
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

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCount = posts.filter((p) => p.createdAt?.startsWith(thisMonth)).length;

  return (
    <div className="an">
      <div className="an__bar">
        <div className="an__bar-left">
          <h1 className="an__title">WR뉴스 관리</h1>
          <p className="an__sub">WR뉴스 게시물을 작성·수정·삭제할 수 있습니다.</p>
        </div>
        <Link href="/admin/wr-news/new" className="an-btn an-btn--primary">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 게시물 작성
        </Link>
      </div>

      <div className="an-stats">
        <div className="an-stat">
          <span className="an-stat__num">{posts.length}</span>
          <span className="an-stat__label">전체 게시물</span>
        </div>
        <div className="an-stat">
          <span className="an-stat__num">{thisMonthCount}</span>
          <span className="an-stat__label">이번 달 작성</span>
        </div>
      </div>

      <div className="an-table-wrap an-table-wrap--wr-news">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__th an-table__th--num">번호</th>
              <th className="an-table__th" style={{ width: '3.5rem' }}>
                썸네일
              </th>
              <th className="an-table__th an-table__th--title">제목</th>
              <th className="an-table__th an-table__th--date">작성일</th>
              <th className="an-table__th an-table__th--views">조회</th>
              <th className="an-table__th an-table__th--actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr key={post.id} className="an-table__row">
                <td className="an-table__td an-table__td--num">{posts.length - idx}</td>
                <td className="an-table__td" style={{ padding: '0.5rem 0.75rem' }}>
                  {post.coverImage ? (
                    <div
                      style={{
                        width: '2.5rem',
                        height: '1.75rem',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        background: 'var(--canvas)',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '2.5rem',
                        height: '1.75rem',
                        borderRadius: '2px',
                        background: 'var(--canvas)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--line)',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M3 17l5-4 3 3 3-2 7 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="an-table__td an-table__td--title">
                  <span className="an-table__title-row">
                    <span className="an-table__notice-title">
                      {post.isSecret ? '🔒 ' : ''}
                      {post.title}
                    </span>
                    {post.hasEnglish ? (
                      <span className="an-en-badge-wrap">
                        <Link
                          href={`/admin/wr-news/${post.id}/en`}
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
                          disabled={clearingId === post.id}
                          onClick={() => handleClearEnglish(post)}
                        >
                          {clearingId === post.id ? '…' : '×'}
                        </button>
                      </span>
                    ) : (
                      <Link
                        href={`/admin/wr-news/${post.id}/en`}
                        className="an-en-badge an-en-badge--add"
                        title="영문 작성"
                      >
                        +EN
                      </Link>
                    )}
                  </span>
                </td>
                <td className="an-table__td an-table__td--date">{post.createdAt}</td>
                <td className="an-table__td an-table__td--views">{post.views.toLocaleString()}</td>
                <td className="an-table__td an-table__td--actions">
                  <div className="an-actions">
                    <Link
                      href={`/wr-news/${post.id}`}
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
                    <Link href={`/admin/wr-news/${post.id}/edit`} className="an-btn an-btn--sm an-btn--ghost">
                      수정
                    </Link>
                    <button
                      type="button"
                      className="an-btn an-btn--sm an-btn--danger-ghost"
                      onClick={() => setDeleteTarget(post)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td className="an-table__empty" colSpan={6}>
                  게시물이 없습니다.{' '}
                  <Link href="/admin/wr-news/new" className="an-table__empty-link">
                    새 게시물을 작성해 보세요.
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
