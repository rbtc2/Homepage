import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notices } from '@/data/notices';

export const metadata = {
  title: '공지사항 | EJJ 홈페이지',
};

const ITEMS_PER_PAGE = 10;

export default async function NoticesPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const pinned = notices.filter((n) => n.isPinned).sort((a, b) => b.id - a.id);
  const normal = notices.filter((n) => !n.isPinned).sort((a, b) => b.id - a.id);

  const totalNormal = normal.length;
  const totalPages = Math.ceil(totalNormal / ITEMS_PER_PAGE);
  const pagedNormal = normal.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const rows = [
    ...(page === 1 ? pinned.map((n) => ({ ...n, rowNum: null })) : []),
    ...pagedNormal.map((n, i) => ({
      ...n,
      rowNum: totalNormal - (page - 1) * ITEMS_PER_PAGE - i,
    })),
  ];

  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">공지사항</h1>
          </div>
        </div>

        <div className="notice-board">
          <div className="notice-board__inner">
            <div className="notice-board__meta">
              <span className="notice-board__count">
                전체 <strong>{notices.length}</strong>건
              </span>
            </div>

            <table className="notice-table">
              <thead className="notice-table__head">
                <tr>
                  <th className="notice-table__th notice-table__th--num">번호</th>
                  <th className="notice-table__th notice-table__th--title">제목</th>
                  <th className="notice-table__th notice-table__th--author">작성자</th>
                  <th className="notice-table__th notice-table__th--date">작성일</th>
                  <th className="notice-table__th notice-table__th--views">조회</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((notice) => (
                  <tr
                    key={notice.id}
                    className={`notice-table__row${notice.isPinned ? ' notice-table__row--pinned' : ''}`}
                  >
                    <td className="notice-table__td notice-table__td--num">
                      {notice.isPinned ? (
                        <span className="notice-badge">공지</span>
                      ) : (
                        notice.rowNum
                      )}
                    </td>
                    <td className="notice-table__td notice-table__td--title">
                      <Link href={`/notices/${notice.id}`} className="notice-table__link">
                        {notice.title}
                      </Link>
                    </td>
                    <td className="notice-table__td notice-table__td--author">{notice.author}</td>
                    <td className="notice-table__td notice-table__td--date">{notice.createdAt}</td>
                    <td className="notice-table__td notice-table__td--views">{notice.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="페이지 탐색">
                {page > 1 && (
                  <Link href={`/notices?page=${page - 1}`} className="pagination__btn" aria-label="이전 페이지">
                    &lsaquo;
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/notices?page=${p}`}
                    className={`pagination__btn${p === page ? ' pagination__btn--active' : ''}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link href={`/notices?page=${page + 1}`} className="pagination__btn" aria-label="다음 페이지">
                    &rsaquo;
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
