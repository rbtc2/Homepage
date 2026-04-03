import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardPagination from '@/components/board/BoardPagination';
import PressBoardList from '@/components/press/PressBoardList';
import { getFeaturedPress, getPressPage, searchPressPage } from '@/lib/press-coverage';
import { addRowNums, calcTotalPages } from '@/lib/paginate';

export const metadata = { title: '언론보도 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
export const revalidate = 60;

const BASE = '/press';

export default async function PressPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page = Math.max(1, Number(pageParam) || 1);

  const isSearching = query.length > 0;

  let rows;
  let totalCount;
  let totalPages;
  let allCount;

  if (isSearching) {
    const { items, totalCount: tc } = await searchPressPage({ query, page });
    totalCount = tc;
    totalPages = calcTotalPages(totalCount);
    allCount = totalCount;
    rows = addRowNums(items, { totalCount, page });
  } else {
    const [featuredItems, { items: normalItems, totalCount: nc }] = await Promise.all([
      getFeaturedPress(),
      getPressPage({ page }),
    ]);
    totalCount = nc;
    totalPages = calcTotalPages(totalCount);
    allCount = totalCount + featuredItems.length;
    rows = [
      ...(page === 1 ? featuredItems.map((n) => ({ ...n, rowNum: null })) : []),
      ...addRowNums(normalItems, { totalCount, page }),
    ];
  }

  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 활동</p>
            <h1 className="page-header__title">언론보도</h1>
            <p className="page-header__lede">
              온라인 언론에 게재된 관련 보도를 안내합니다. 카드를 눌러 출처와 요약을 확인하고 원문으로 이동할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="notice-board press-board">
          <div className="notice-board__inner">
            <div className="notice-board__toolbar">
              <BoardMeta
                basePath={BASE}
                isSearching={isSearching}
                query={query}
                searchCount={totalCount}
                allCount={allCount}
              />
              <BoardSearchForm basePath={BASE} ariaLabel="언론보도 검색" defaultValue={query} />
            </div>
            <PressBoardList
              rows={rows}
              basePath={BASE}
              isSearching={isSearching}
              query={query}
              emptyText="언론보도를"
            />
            <BoardPagination page={page} totalPages={totalPages} basePath={BASE} query={query} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
