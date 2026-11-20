import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import BoardTable from '@/components/board/BoardTable';
import BoardPagination from '@/components/board/BoardPagination';
import ArchiveCategoryFilter from '@/components/archive/ArchiveCategoryFilter';
import { getArchivesPage, searchArchivesPage } from '@/lib/archive';
import {
  archivePublicPath,
  categoryLabel,
  getArchiveCategoryState,
} from '@/lib/archive-categories';
import { addRowNums, buildBoardHref, calcTotalPages } from '@/lib/paginate';

export const metadata = { title: '자료실 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
export const revalidate = 60;

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArchivePage({ searchParams, locale = 'ko' }) {
  const params = await searchParams;
  const query = firstParam(params.q)?.trim() ?? '';
  const page = Math.max(1, Number(firstParam(params.page)) || 1);
  const requestedCategory = firstParam(params.category)?.trim() ?? '';
  const basePath = archivePublicPath(locale);
  const isSearching = query.length > 0;

  const categoryState = await getArchiveCategoryState();
  const currentCategory = categoryState.enabled
    ? categoryState.categories.find((category) => category.id === requestedCategory) ?? null
    : null;
  const categoryId = currentCategory?.id;
  const showCategories = categoryState.enabled && categoryState.categories.length > 0;

  const { items, totalCount } = await (isSearching
    ? searchArchivesPage({ query, page, categoryId })
    : getArchivesPage({ page, categoryId }));

  const totalPages = calcTotalPages(totalCount);
  const rows = addRowNums(items, { totalCount, page });
  const categoryLabels = showCategories
    ? Object.fromEntries(
      categoryState.categories.map((category) => [category.id, categoryLabel(category, locale)])
    )
    : null;
  const extra = categoryId ? { category: categoryId } : undefined;
  const filterLabel = currentCategory ? categoryLabel(currentCategory, locale) : '';

  return (
    <>
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">자료실</h1>
          </div>
        </div>
        <div className="notice-board">
          <div className="notice-board__inner">
            {showCategories ? (
              <ArchiveCategoryFilter
                categories={categoryState.categories}
                currentId={categoryId}
                basePath={basePath}
                query={query}
                locale={locale}
              />
            ) : null}
            <div className="notice-board__toolbar">
              <BoardMeta
                basePath={basePath}
                isSearching={isSearching}
                query={query}
                searchCount={totalCount}
                allCount={totalCount}
                locale={locale}
                clearHref={buildBoardHref(basePath, 1, '', extra)}
                idleCount={filterLabel ? (
                  locale === 'en' ? (
                    <>
                      <strong>{filterLabel}</strong>
                      {' · '}
                      <strong>{totalCount}</strong>
                    </>
                  ) : (
                    <>
                      <strong>{filterLabel}</strong>
                      {' '}
                      <strong>{totalCount}</strong>
                      건
                    </>
                  )
                ) : null}
              />
              <BoardSearchForm
                basePath={basePath}
                ariaLabel={locale === 'en' ? 'Search archive' : '자료실 검색'}
                defaultValue={query}
                locale={locale}
                hiddenFields={extra}
              />
            </div>
            <BoardTable
              rows={rows}
              basePath={basePath}
              isSearching={isSearching}
              query={query}
              emptyText={locale === 'en' ? 'archive posts' : '자료를'}
              locale={locale}
              categoryLabels={categoryLabels}
            />
            <BoardPagination
              page={page}
              totalPages={totalPages}
              basePath={basePath}
              query={query}
              locale={locale}
              extra={extra}
            />
          </div>
        </div>
      </main>
    </>
  );
}
