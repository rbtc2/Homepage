import Link from 'next/link';
import { galleryUi } from '@/lib/gallery-ui';

/**
 * 연도 필터 칩 바
 *
 * @param {string[]} years       - 게시물이 있는 연도 배열 (내림차순)
 * @param {string|null} currentYear  - 현재 선택된 연도 (null = 전체)
 * @param {number} totalCount    - 현재 조건의 전체 게시물 수
 * @param {string} basePath
 */
export default function GalleryFilterBar({
  years,
  currentYear,
  totalCount,
  basePath = '/gallery',
  locale = 'ko',
}) {
  const ui = galleryUi(locale);

  return (
    <div className="gallery-filter">
      <div className="gallery-filter__chips" role="list" aria-label={ui.filterAria}>
        <Link
          href={basePath}
          className={`gallery-filter__chip${!currentYear ? ' gallery-filter__chip--active' : ''}`}
          aria-current={!currentYear ? 'true' : undefined}
          role="listitem"
        >
          {ui.all}
        </Link>

        {years.map((year) => (
          <Link
            key={year}
            href={`${basePath}?year=${year}`}
            className={`gallery-filter__chip${currentYear === year ? ' gallery-filter__chip--active' : ''}`}
            aria-current={currentYear === year ? 'true' : undefined}
            role="listitem"
          >
            {year}
          </Link>
        ))}
      </div>

      <p className="gallery-filter__count">
        {currentYear ? (
          <>
            <strong>{currentYear}{ui.yearSuffix}</strong>
            {' · '}
            {ui.countPrefix ? `${ui.countPrefix} ` : null}
            <strong>{totalCount}</strong>
            {ui.countSuffix}
          </>
        ) : (
          <>
            {ui.countPrefix ? `${ui.countPrefix} ` : null}
            <strong>{totalCount}</strong>
            {ui.countSuffix}
          </>
        )}
      </p>
    </div>
  );
}
