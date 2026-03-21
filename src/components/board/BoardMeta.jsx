import Link from 'next/link';

export default function BoardMeta({ basePath, isSearching, query, searchCount, allCount }) {
  return (
    <div className="notice-board__meta">
      {isSearching ? (
        <span className="notice-board__count">
          <span className="notice-board__query-tag">
            <span className="notice-board__query-text">&ldquo;{query}&rdquo;</span>
            검색 결과&nbsp;<strong>{searchCount}</strong>건
          </span>
          <Link href={basePath} className="notice-board__clear" aria-label="검색 초기화">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            초기화
          </Link>
        </span>
      ) : (
        <span className="notice-board__count">
          전체 <strong>{allCount}</strong>건
        </span>
      )}
    </div>
  );
}
