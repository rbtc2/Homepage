import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardTable from '@/components/board/BoardTable';
import BoardPagination from '@/components/board/BoardPagination';
import { getArchives, searchArchives } from '@/lib/archive';
import { paginateSorted } from '@/lib/paginate';

export const metadata = { title: '자료실 | EJJ 홈페이지' };
export const dynamic = 'force-dynamic';

const BASE = '/archive';

export default async function ArchivePage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page  = Math.max(1, Number(pageParam) || 1);

  const isSearching = query.length > 0;
  const allArchives = await getArchives();

  const source = isSearching
    ? (await searchArchives(query)).sort((a, b) => b.id - a.id)
    : [...allArchives].sort((a, b) => b.id - a.id);

  const { rows, totalCount, totalPages } = paginateSorted(source, { page });

  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">자료실</h1>
          </div>
        </div>
        <div className="notice-board">
          <div className="notice-board__inner">
            <BoardSearchForm basePath={BASE} ariaLabel="자료실 검색" defaultValue={query} />
            <BoardMeta basePath={BASE} isSearching={isSearching} query={query} searchCount={totalCount} allCount={allArchives.length} />
            <BoardTable rows={rows} basePath={BASE} isSearching={isSearching} query={query} emptyText="자료를" />
            <BoardPagination page={page} totalPages={totalPages} basePath={BASE} query={query} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
