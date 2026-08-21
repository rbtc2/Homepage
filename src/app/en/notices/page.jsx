import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardTable from '@/components/board/BoardTable';
import BoardPagination from '@/components/board/BoardPagination';
import {
  getPinnedNotices,
  getNoticesPage,
  searchNoticesPage,
  localizeNotices,
} from '@/lib/notices';
import { noticesUi } from '@/lib/notices-ui';
import { addRowNums, calcTotalPages } from '@/lib/paginate';

export const metadata = { title: 'Notices | WORLD RIGHTS' };
export const revalidate = 60;

const BASE = '/en/notices';
const LOCALE = 'en';

export default async function EnNoticesPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page = Math.max(1, Number(pageParam) || 1);
  const isSearching = query.length > 0;
  const ui = noticesUi(LOCALE);

  let rows;
  let totalCount;
  let totalPages;
  let allCount;

  if (isSearching) {
    const { items, totalCount: tc } = await searchNoticesPage({ query, page });
    totalCount = tc;
    totalPages = calcTotalPages(totalCount);
    allCount = totalCount;
    rows = addRowNums(localizeNotices(items, LOCALE), { totalCount, page });
  } else {
    const [pinnedItems, { items: normalItems, totalCount: nc }] = await Promise.all([
      getPinnedNotices(),
      getNoticesPage({ page }),
    ]);
    totalCount = nc;
    totalPages = calcTotalPages(totalCount);
    allCount = totalCount + pinnedItems.length;
    rows = [
      ...(page === 1
        ? localizeNotices(pinnedItems, LOCALE).map((n) => ({ ...n, rowNum: null }))
        : []),
      ...addRowNums(localizeNotices(normalItems, LOCALE), { totalCount, page }),
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
      <div className="notice-board">
        <div className="notice-board__inner">
          <div className="notice-board__toolbar">
            <BoardMeta
              locale={LOCALE}
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
          <BoardTable
            locale={LOCALE}
            rows={rows}
            basePath={BASE}
            isSearching={isSearching}
            query={query}
            emptyText={ui.emptyText}
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
