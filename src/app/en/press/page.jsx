import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardPagination from '@/components/board/BoardPagination';
import PressBoardList from '@/components/press/PressBoardList';
import { getFeaturedPress, getPressPage, searchPressPage } from '@/lib/press-coverage';
import { pressUi } from '@/lib/press-ui';
import { addRowNums, calcTotalPages } from '@/lib/paginate';

export const metadata = { title: 'Press | WORLD RIGHTS' };
export const revalidate = 60;

const BASE = '/en/press';
const LOCALE = 'en';

export default async function EnPressPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page = Math.max(1, Number(pageParam) || 1);
  const ui = pressUi(LOCALE);
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
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">{ui.sectionLabel}</p>
          <h1 className="page-header__title">{ui.title}</h1>
        </div>
      </div>
      <div className="notice-board press-board">
        <div className="notice-board__inner">
          <div className="notice-board__toolbar">
            <BoardMeta
              locale={LOCALE}
              enAllUnit={ui.metaUnit}
              basePath={BASE}
              isSearching={isSearching}
              query={query}
              searchCount={totalCount}
              allCount={allCount}
            />
            <BoardSearchForm
              locale={LOCALE}
              basePath={BASE}
              ariaLabel={ui.searchAria}
              placeholder={ui.searchPlaceholder}
              submitLabel={ui.searchSubmit}
              defaultValue={query}
            />
          </div>
          <PressBoardList
            locale={LOCALE}
            rows={rows}
            basePath={BASE}
            isSearching={isSearching}
            query={query}
          />
          <BoardPagination
            locale={LOCALE}
            page={page}
            totalPages={totalPages}
            basePath={BASE}
            query={query}
          />
        </div>
      </div>
    </main>
  );
}
