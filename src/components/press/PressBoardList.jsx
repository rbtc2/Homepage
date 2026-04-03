import Link from 'next/link';
import HighlightedText from '@/components/board/HighlightedText';

/**
 * 언론보도 카드형 목록 (외부 기사 메타 중심)
 */
export default function PressBoardList({ rows, basePath, isSearching, query, emptyText }) {
  if (rows.length === 0) {
    return (
      <div className="press-empty">
        <span className="press-empty__icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <circle cx="15" cy="15" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M22 22L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 15h6M15 12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        {isSearching ? (
          <>
            <p className="press-empty__title">검색 결과가 없습니다</p>
            <p className="press-empty__desc">
              &ldquo;{query}&rdquo;에 해당하는 {emptyText} 찾지 못했습니다.
              <br />
              다른 검색어를 입력하거나{' '}
              <Link href={basePath} className="press-empty__link">
                전체 목록
              </Link>
              을 확인하세요.
            </p>
          </>
        ) : (
          <p className="press-empty__title">등록된 언론보도가 없습니다</p>
        )}
      </div>
    );
  }

  return (
    <ul className="press-grid" role="list">
      {rows.map((item) => {
        const featured = item.isFeatured && !isSearching;
        const excerpt = item.summary?.trim() || '요약이 없습니다. 상세에서 원문을 확인하세요.';
        return (
          <li key={item.id}>
            <article className={`press-card${featured ? ' press-card--featured' : ''}`}>
              <div className="press-card__main">
                <p className="press-card__meta">
                  {featured && <span className="press-card__badge">대표</span>}
                  <span className="press-card__source">{item.sourceName}</span>
                  <span className="press-card__sep" aria-hidden="true">
                    ·
                  </span>
                  <time className="press-card__date" dateTime={item.publishedAt}>
                    게재 {item.publishedAt}
                  </time>
                </p>
                <h2 className="press-card__title">
                  <Link href={`${basePath}/${item.id}`} className="press-card__title-link">
                    {isSearching ? <HighlightedText text={item.title} query={query} /> : item.title}
                  </Link>
                </h2>
                <p className="press-card__excerpt">
                  {isSearching ? <HighlightedText text={excerpt} query={query} /> : excerpt}
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
