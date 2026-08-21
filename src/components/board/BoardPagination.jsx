import Link from 'next/link';
import { buildBoardHref } from '@/lib/paginate';

export default function BoardPagination({ page, totalPages, basePath, query, locale = 'ko' }) {
  if (totalPages <= 1) return null;

  const aria = locale === 'en' ? 'Pagination' : '페이지 탐색';
  const prevLabel = locale === 'en' ? 'Previous page' : '이전 페이지';
  const nextLabel = locale === 'en' ? 'Next page' : '다음 페이지';

  return (
    <nav className="pagination" aria-label={aria}>
      {page > 1 && (
        <Link
          href={buildBoardHref(basePath, page - 1, query)}
          className="pagination__btn"
          aria-label={prevLabel}
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildBoardHref(basePath, p, query)}
          className={`pagination__btn${p === page ? ' pagination__btn--active' : ''}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={buildBoardHref(basePath, page + 1, query)}
          className="pagination__btn"
          aria-label={nextLabel}
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
