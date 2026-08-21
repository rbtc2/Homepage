import Link from 'next/link';
import GalleryCard from './GalleryCard';
import { galleryUi } from '@/lib/gallery-ui';

function buildGalleryHref(basePath, page, year) {
  const params = new URLSearchParams();
  if (year) params.set('year', year);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function GalleryPagination({ page, totalPages, basePath, year, locale = 'ko' }) {
  if (totalPages <= 1) return null;
  const ui = galleryUi(locale);

  return (
    <nav className="pagination" aria-label={ui.paginationAria}>
      {page > 1 && (
        <Link
          href={buildGalleryHref(basePath, page - 1, year)}
          className="pagination__btn"
          aria-label={ui.prevPage}
        >
          &lsaquo;
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildGalleryHref(basePath, p, year)}
          className={`pagination__btn${p === page ? ' pagination__btn--active' : ''}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={buildGalleryHref(basePath, page + 1, year)}
          className="pagination__btn"
          aria-label={ui.nextPage}
        >
          &rsaquo;
        </Link>
      )}
    </nav>
  );
}

/**
 * 불균형 Masonry 그리드 + 빈 상태 + 페이지네이션
 *
 * @param {object[]} items
 * @param {number}   totalCount
 * @param {number}   page
 * @param {number}   totalPages
 * @param {string|null} currentYear
 * @param {string}   basePath
 */
export default function GalleryGrid({
  items,
  totalCount,
  page,
  totalPages,
  currentYear,
  basePath = '/gallery',
  locale = 'ko',
}) {
  const ui = galleryUi(locale);

  if (items.length === 0) {
    return (
      <div className="gallery-empty">
        <div className="gallery-empty__icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="8" width="32" height="25" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="14" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 27l9-8 6 5 5-4 12 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="gallery-empty__title">
          {currentYear ? ui.emptyYear(currentYear) : ui.emptyNone}
        </p>
        <p className="gallery-empty__desc">
          {currentYear ? (
            <>
              <Link href={basePath} style={{ color: 'var(--brand)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                {ui.emptyBack}
              </Link>
              {ui.emptyBackSuffix}
            </>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid" aria-label={ui.listAria}>
        {items.map((post, i) => (
          <GalleryCard
            key={post.id}
            post={post}
            basePath={basePath}
            index={i}
          />
        ))}
      </div>

      <GalleryPagination
        locale={locale}
        page={page}
        totalPages={totalPages}
        basePath={basePath}
        year={currentYear}
      />
    </>
  );
}
