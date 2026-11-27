import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardTable from '@/components/board/BoardTable';
import BoardPagination from '@/components/board/BoardPagination';
import CategoryFilter from '@/components/board/CategoryFilter';
import CategoryCount from '@/components/board/CategoryCount';
import { getPinnedNotices, getNoticesPage, searchNoticesPage } from '@/lib/notices';
import { getBoardCategoryState } from '@/lib/board-categories';
import { categoryLabel } from '@/lib/archive-category-shared';
import { addRowNums, buildBoardHref, calcTotalPages } from '@/lib/paginate';

export const metadata = { title: '공지사항 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
export const revalidate = 60;

const BASE = '/notices';

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NoticesPage({ searchParams }) {
  const params = await searchParams;
  const query = firstParam(params.q)?.trim() ?? '';
  const page = Math.max(1, Number(firstParam(params.page)) || 1);
  const requestedCategory = firstParam(params.category)?.trim() ?? '';

  const isSearching = query.length > 0;

  const categoryState = await getBoardCategoryState('notices');
  const currentCategory = categoryState.enabled
    ? categoryState.categories.find((category) => category.id === requestedCategory) ?? null
    : null;
  const categoryId = currentCategory?.id;
  const showCategories = categoryState.enabled && categoryState.categories.length > 0;

  let rows, totalCount, totalPages, allCount;

  if (isSearching) {
    const { items, totalCount: tc } = await searchNoticesPage({ query, page, categoryId });
    totalCount = tc;
    totalPages = calcTotalPages(totalCount);
    allCount   = totalCount;
    rows       = addRowNums(items, { totalCount, page });
  } else {
    const [pinnedItems, { items: normalItems, totalCount: nc }] = await Promise.all([
      getPinnedNotices({ categoryId }),
      getNoticesPage({ page, categoryId }),
    ]);
    totalCount = nc;
    totalPages = calcTotalPages(totalCount);
    allCount   = totalCount + pinnedItems.length;
    rows = [
      ...(page === 1 ? pinnedItems.map((n) => ({ ...n, rowNum: null })) : []),
      ...addRowNums(normalItems, { totalCount, page }),
    ];
  }

  const categoryLabels = showCategories
    ? Object.fromEntries(
      categoryState.categories.map((category) => [category.id, categoryLabel(category, 'ko')])
    )
    : null;
  const extra = categoryId ? { category: categoryId } : undefined;
  const filterLabel = currentCategory ? categoryLabel(currentCategory, 'ko') : '';

  return (
    <>
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">공지사항</h1>
          </div>
        </div>
        <div className="notice-board">
          <div className="notice-board__inner">
            {showCategories ? (
              <CategoryFilter
                categories={categoryState.categories}
                currentId={categoryId}
                basePath={BASE}
                query={query}
              />
            ) : null}
            <div className="notice-board__toolbar">
              <BoardMeta
                basePath={BASE}
                isSearching={isSearching}
                query={query}
                searchCount={totalCount}
                allCount={allCount}
                clearHref={buildBoardHref(BASE, 1, '', extra)}
                idleCount={
                  filterLabel ? <CategoryCount label={filterLabel} count={allCount} /> : null
                }
              />
              <BoardSearchForm
                basePath={BASE}
                ariaLabel="공지사항 검색"
                defaultValue={query}
                hiddenFields={extra}
              />
            </div>
            <BoardTable
              rows={rows}
              basePath={BASE}
              isSearching={isSearching}
              query={query}
              emptyText="공지사항을"
              categoryLabels={categoryLabels}
            />
            <BoardPagination
              page={page}
              totalPages={totalPages}
              basePath={BASE}
              query={query}
              extra={extra}
            />
          </div>
        </div>
      </main>
    </>
  );
}
