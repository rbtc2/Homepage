import Link from 'next/link';
import { buildBoardHref } from '@/lib/paginate';
import { categoryLabel } from '@/lib/archive-category-shared';

export default function ArchiveCategoryFilter({
  categories,
  currentId,
  basePath,
  query = '',
  locale = 'ko',
}) {
  if (!categories?.length) return null;
  const allLabel = locale === 'en' ? 'All' : '전체';

  return (
    <div className="board-filter">
      <div className="board-filter__chips" role="list" aria-label={locale === 'en' ? 'Categories' : '분류'}>
        <Link
          href={buildBoardHref(basePath, 1, query)}
          className={`board-filter__chip${!currentId ? ' board-filter__chip--active' : ''}`}
          aria-current={!currentId ? 'true' : undefined}
          role="listitem"
        >
          {allLabel}
        </Link>
        {categories.map((category) => {
          const active = currentId === category.id;
          return (
            <Link
              key={category.id}
              href={buildBoardHref(basePath, 1, query, { category: category.id })}
              className={`board-filter__chip${active ? ' board-filter__chip--active' : ''}`}
              aria-current={active ? 'true' : undefined}
              role="listitem"
            >
              {categoryLabel(category, locale)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
