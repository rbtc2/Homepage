import Link from 'next/link';

const COPY = {
  ko: {
    results: (query, count) => (
      <>
        <span className="notice-board__query-text">&ldquo;{query}&rdquo;</span>
        검색 결과&nbsp;<strong>{count}</strong>건
      </>
    ),
    clear: '초기화',
    clearAria: '검색 초기화',
    all: (count) => (
      <>
        전체 <strong>{count}</strong>건
      </>
    ),
  },
  en: {
    results: (query, count) => (
      <>
        <span className="notice-board__query-text">&ldquo;{query}&rdquo;</span>
        {' '}
        <strong>{count}</strong> results
      </>
    ),
    clear: 'Clear',
    clearAria: 'Clear search',
    all: (count, unit = 'posts') => (
      <>
        <strong>{count}</strong> {unit}
      </>
    ),
  },
};

export default function BoardMeta({
  basePath,
  isSearching,
  query,
  searchCount,
  allCount,
  locale = 'ko',
  enAllUnit = 'posts',
}) {
  const ui = COPY[locale] ?? COPY.ko;

  return (
    <div className="notice-board__meta">
      {isSearching ? (
        <span className="notice-board__count">
          <span className="notice-board__query-tag">
            {ui.results(query, searchCount)}
          </span>
          <Link href={basePath} className="notice-board__clear" aria-label={ui.clearAria}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {ui.clear}
          </Link>
        </span>
      ) : (
        <span className="notice-board__count">{ui.all(allCount, locale === 'en' ? enAllUnit : undefined)}</span>
      )}
    </div>
  );
}
