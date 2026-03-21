import Link from 'next/link';

/**
 * 연도 필터 칩 바
 *
 * @param {string[]} years       - 게시물이 있는 연도 배열 (내림차순)
 * @param {string|null} currentYear  - 현재 선택된 연도 (null = 전체)
 * @param {number} totalCount    - 현재 조건의 전체 게시물 수
 * @param {string} basePath
 */
export default function GalleryFilterBar({ years, currentYear, totalCount, basePath = '/gallery' }) {
  return (
    <div className="gallery-filter">
      <div className="gallery-filter__chips" role="list" aria-label="연도별 필터">
        <Link
          href={basePath}
          className={`gallery-filter__chip${!currentYear ? ' gallery-filter__chip--active' : ''}`}
          aria-current={!currentYear ? 'true' : undefined}
          role="listitem"
        >
          전체
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
        {currentYear
          ? <><strong>{currentYear}년</strong> · 전체 <strong>{totalCount}</strong>건</>
          : <>전체 <strong>{totalCount}</strong>건</>
        }
      </p>
    </div>
  );
}
