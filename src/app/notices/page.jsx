import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNotices, searchNotices } from '@/lib/notices';

export const metadata = {
  title: '공지사항 | EJJ 홈페이지',
};

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 10;

function buildHref(page, query) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/notices?${qs}` : '/notices';
}

export default async function NoticesPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page = Math.max(1, Number(pageParam) || 1);

  const isSearching = query.length > 0;

  const allNotices = await getNotices();
  let rows;
  let totalPages;
  let totalCount;

  if (isSearching) {
    const matched = (await searchNotices(query)).sort((a, b) => b.id - a.id);
    totalCount = matched.length;
    totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const paged = matched.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    rows = paged.map((n, i) => ({
      ...n,
      rowNum: totalCount - (page - 1) * ITEMS_PER_PAGE - i,
    }));
  } else {
    const pinned = allNotices.filter((n) => n.isPinned).sort((a, b) => b.id - a.id);
    const normal = allNotices.filter((n) => !n.isPinned).sort((a, b) => b.id - a.id);
    totalCount = normal.length;
    totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const pagedNormal = normal.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    rows = [
      ...(page === 1 ? pinned.map((n) => ({ ...n, rowNum: null })) : []),
      ...pagedNormal.map((n, i) => ({
        ...n,
        rowNum: totalCount - (page - 1) * ITEMS_PER_PAGE - i,
      })),
    ];
  }

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

            <form
              method="get"
              action="/notices"
              className="notice-search"
              role="search"
              aria-label="공지사항 검색"
            >
              <div className="notice-search__field">
                <svg
                  className="notice-search__icon"
                  width="16" height="16" viewBox="0 0 16 16"
                  fill="none" aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="search"
                  name="q"
                  className="notice-search__input"
                  placeholder="제목 또는 내용으로 검색"
                  defaultValue={query}
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="notice-search__btn">검색</button>
            </form>

            <div className="notice-board__meta">
              {isSearching ? (
                <span className="notice-board__count">
                  <span className="notice-board__query-tag">
                    <span className="notice-board__query-text">&ldquo;{query}&rdquo;</span>
                    검색 결과&nbsp;<strong>{totalCount}</strong>건
                  </span>
                  <Link href="/notices" className="notice-board__clear" aria-label="검색 초기화">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    초기화
                  </Link>
                </span>
              ) : (
                <span className="notice-board__count">
                  전체 <strong>{allNotices.length}</strong>건
                </span>
              )}
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
                {rows.length === 0 ? (
                  <tr>
                    <td className="notice-table__empty" colSpan={5}>
                      <span className="notice-table__empty-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <circle cx="15" cy="15" r="9" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M22 22L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M12 15h6M15 12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </span>
                      <p className="notice-table__empty-title">검색 결과가 없습니다</p>
                      <p className="notice-table__empty-desc">
                        &ldquo;{query}&rdquo;에 해당하는 공지사항을 찾지 못했습니다.
                        <br />다른 검색어를 입력하거나{' '}
                        <Link href="/notices" className="notice-table__empty-link">전체 목록</Link>을 확인하세요.
                      </p>
                    </td>
                  </tr>
                ) : (
                  rows.map((notice) => (
                    <tr
                      key={notice.id}
                      className={`notice-table__row${notice.isPinned && !isSearching ? ' notice-table__row--pinned' : ''}`}
                    >
                      <td className="notice-table__td notice-table__td--num">
                        {notice.isPinned && !isSearching ? (
                          <span className="notice-badge">공지</span>
                        ) : (
                          notice.rowNum
                        )}
                      </td>
                      <td className="notice-table__td notice-table__td--title">
                        <Link href={`/notices/${notice.id}`} className="notice-table__link">
                          {isSearching
                            ? <HighlightedText text={notice.title} query={query} />
                            : notice.title}
                        </Link>
                      </td>
                      <td className="notice-table__td notice-table__td--author">{notice.author}</td>
                      <td className="notice-table__td notice-table__td--date">{notice.createdAt}</td>
                      <td className="notice-table__td notice-table__td--views">{notice.views.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="페이지 탐색">
                {page > 1 && (
                  <Link
                    href={buildHref(page - 1, query)}
                    className="pagination__btn"
                    aria-label="이전 페이지"
                  >
                    &lsaquo;
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildHref(p, query)}
                    className={`pagination__btn${p === page ? ' pagination__btn--active' : ''}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={buildHref(page + 1, query)}
                    className="pagination__btn"
                    aria-label="다음 페이지"
                  >
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

function HighlightedText({ text, query }) {
  const q = query.trim().toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="notice-highlight">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
