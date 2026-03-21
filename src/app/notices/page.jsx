import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardTable from '@/components/board/BoardTable';
import BoardPagination from '@/components/board/BoardPagination';
import { getPinnedNotices, getNoticesPage, searchNoticesPage } from '@/lib/notices';
import { addRowNums, calcTotalPages } from '@/lib/paginate';

export const metadata = { title: '공지사항 | EJJ 홈페이지' };
export const revalidate = 60;

const BASE = '/notices';

export default async function NoticesPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page  = Math.max(1, Number(pageParam) || 1);

  const isSearching = query.length > 0;

  let rows, totalCount, totalPages, allCount;

  if (isSearching) {
    const { items, totalCount: tc } = await searchNoticesPage({ query, page });
    totalCount = tc;
    totalPages = calcTotalPages(totalCount);
    allCount   = totalCount;
    rows       = addRowNums(items, { totalCount, page });
  } else {
    const [pinnedItems, { items: normalItems, totalCount: nc }] = await Promise.all([
      getPinnedNotices(),
      getNoticesPage({ page }),
    ]);
    totalCount = nc;
    totalPages = calcTotalPages(totalCount);
    allCount   = totalCount + pinnedItems.length;
    rows = [
      ...(page === 1 ? pinnedItems.map((n) => ({ ...n, rowNum: null })) : []),
      ...addRowNums(normalItems, { totalCount, page }),
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
            <BoardSearchForm basePath={BASE} ariaLabel="공지사항 검색" defaultValue={query} />
            <BoardMeta basePath={BASE} isSearching={isSearching} query={query} searchCount={totalCount} allCount={allCount} />
            <BoardTable rows={rows} basePath={BASE} isSearching={isSearching} query={query} emptyText="공지사항을" />
            <BoardPagination page={page} totalPages={totalPages} basePath={BASE} query={query} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
