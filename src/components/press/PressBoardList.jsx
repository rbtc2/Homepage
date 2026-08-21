import Link from 'next/link';
import HighlightedText from '@/components/board/HighlightedText';
import { pressUi } from '@/lib/press-ui';

export default function PressBoardList({
  rows,
  basePath,
  isSearching,
  query,
  locale = 'ko',
}) {
  const ui = pressUi(locale);

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
            <p className="press-empty__title">{ui.emptySearchTitle}</p>
            <p className="press-empty__desc">
              {ui.emptySearchLead(query)}
              <br />
              {ui.emptySearchHint}{' '}
              <Link href={basePath} className="press-empty__link">
                {ui.emptySearchBack}
              </Link>
              {ui.emptySearchBackSuffix}
            </p>
          </>
        ) : (
          <p className="press-empty__title">{ui.emptyNone}</p>
        )}
      </div>
    );
  }

  return (
    <ul className="press-grid" role="list">
      {rows.map((item) => {
        const featured = Boolean(item.isFeatured) && !isSearching;
        const excerpt = item.summary?.trim() || ui.excerptFallback;
        return (
          <li key={item.id}>
            <article className={`press-card${featured ? ' press-card--featured' : ''}`}>
              <div className="press-card__main">
                <p className="press-card__meta">
                  {featured ? <span className="press-card__badge">{ui.featured}</span> : null}
                  <span className="press-card__source">{item.sourceName}</span>
                  <span className="press-card__sep" aria-hidden="true">
                    ·
                  </span>
                  <time className="press-card__date" dateTime={item.publishedAt}>
                    {ui.published(item.publishedAt)}
                  </time>
                </p>
                <h2 className="press-card__title">
                  <Link href={`${basePath}/${item.id}`} className="press-card__title-link">
                    {item.isSecret ? '🔒 ' : ''}
                    {isSearching ? <HighlightedText text={item.title} query={query} /> : item.title}
                  </Link>
                </h2>
                <p className="press-card__excerpt">
                  {item.isSecret
                    ? ui.secretExcerpt
                    : isSearching
                      ? <HighlightedText text={excerpt} query={query} />
                      : excerpt}
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
