import Link from 'next/link';
import GalleryCard from '@/components/gallery/GalleryCard';
import BoardPagination from '@/components/board/BoardPagination';

/**
 * WR뉴스 썸네일 그리드 + 빈 상태 + 페이지네이션
 *
 * @param {object[]} items
 * @param {number} page
 * @param {number} totalPages
 * @param {string} basePath
 * @param {string} query
 * @param {boolean} isSearching
 */
export default function WrNewsGrid({
  items,
  page,
  totalPages,
  basePath = '/wr-news',
  query = '',
  isSearching = false,
}) {
  if (items.length === 0) {
    return (
      <div className="gallery-empty">
        <div className="gallery-empty__icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="8" width="32" height="25" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="14" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M4 27l9-8 6 5 5-4 12 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="gallery-empty__title">
          {isSearching ? '검색 결과가 없습니다' : '등록된 게시물이 없습니다'}
        </p>
        {isSearching && (
          <p className="gallery-empty__desc">
            <Link
              href={basePath}
              style={{ color: 'var(--brand)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              전체 목록
            </Link>
            으로 돌아가 보세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid" aria-label="WR뉴스 목록">
        {items.map((post, i) => (
          <GalleryCard key={post.id} post={post} basePath={basePath} index={i} />
        ))}
      </div>
      <BoardPagination page={page} totalPages={totalPages} basePath={basePath} query={query} />
    </>
  );
}
