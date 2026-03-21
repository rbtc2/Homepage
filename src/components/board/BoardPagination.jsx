import Link from 'next/link';
import { buildBoardHref } from '@/lib/paginate';

export default function BoardPagination({ page, totalPages, basePath, query }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="페이지 탐색">
      {page > 1 && (
        <Link
          href={buildBoardHref(basePath, page - 1, query)}
          className="pagination__btn"
          aria-label="이전 페이지"
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
          aria-label="다음 페이지"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
