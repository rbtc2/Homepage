import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardTable from '@/components/board/BoardTable';
import BoardPagination from '@/components/board/BoardPagination';
import { getNotices, searchNotices } from '@/lib/notices';
import { paginateSorted } from '@/lib/paginate';

export const metadata = { title: '공지사항 | EJJ 홈페이지' };
export const dynamic = 'force-dynamic';

const BASE = '/notices';

export default async function NoticesPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page  = Math.max(1, Number(pageParam) || 1);

  const isSearching = query.length > 0;
  const allNotices  = await getNotices();

  let rows, totalCount, totalPages;

  if (isSearching) {
    const matched = (await searchNotices(query)).sort((a, b) => b.id - a.id);
    ({ rows, totalCount, totalPages } = paginateSorted(matched, { page }));
  } else {
    const pinned = allNotices.filter((n) => n.isPinned).sort((a, b) => b.id - a.id);
    const normal = allNotices.filter((n) => !n.isPinned).sort((a, b) => b.id - a.id);
    const { rows: normalRows, totalCount: nc, totalPages: tp } = paginateSorted(normal, { page });
    totalCount = nc;
    totalPages = tp;
    rows = [
      ...(page === 1 ? pinned.map((n) => ({ ...n, rowNum: null })) : []),
      ...normalRows,
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
            <BoardMeta basePath={BASE} isSearching={isSearching} query={query} searchCount={totalCount} allCount={allNotices.length} />
            <BoardTable rows={rows} basePath={BASE} isSearching={isSearching} query={query} emptyText="공지사항을" />
            <BoardPagination page={page} totalPages={totalPages} basePath={BASE} query={query} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
