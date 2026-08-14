import Link from 'next/link';
import Image from 'next/image';
import BoardPagination from '@/components/board/BoardPagination';

function toPlainSnippet(html, max) {
  if (!html || typeof html !== 'string') return '';
  const t = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function formatYmd(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/**
 * WR뉴스 — 큰 썸네일 목록 + 빈 상태 + 페이지네이션
 */
export default function WrNewsList({
  items,
  page,
  totalPages,
  basePath = '/wr-news',
  query = '',
  isSearching = false,
}) {
  if (items.length === 0) {
    return (
      <div className="wnl-empty">
        <div className="wnl-empty__icon" aria-hidden="true">
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
        <p className="wnl-empty__title">
          {isSearching ? '검색 결과가 없습니다' : '등록된 게시물이 없습니다'}
        </p>
        {isSearching ? (
          <p className="wnl-empty__desc">
            <Link href={basePath} className="wnl-empty__link">
              전체 목록
            </Link>
            으로 돌아가 보세요.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <ul className="wnl" aria-label="WR뉴스 목록">
        {items.map((post, i) => {
          const snippet = toPlainSnippet(post.content, 160);
          const date = formatYmd(post.createdAt);

          return (
            <li key={post.id} className="wnl__item">
              <Link href={`${basePath}/${post.id}`} className="wnl__link">
                <span className="wnl__thumb">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      className="wnl__img"
                      sizes="(max-width: 768px) 100vw, 320px"
                      priority={i < 2}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="wnl__thumb-fallback" aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M3 22l7-6 5 4 4-3 10 7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </span>
                <span className="wnl__body">
                  <span className="wnl__title">{post.title}</span>
                  {snippet ? <span className="wnl__snip">{snippet}</span> : null}
                  <span className="wnl__meta">
                    <span>{post.author}</span>
                    {date ? (
                      <>
                        <span className="wnl__meta-dot" aria-hidden="true">
                          ·
                        </span>
                        <time dateTime={post.createdAt}>{date}</time>
                      </>
                    ) : null}
                    {post.views > 0 ? (
                      <>
                        <span className="wnl__meta-dot" aria-hidden="true">
                          ·
                        </span>
                        <span>조회 {post.views.toLocaleString()}</span>
                      </>
                    ) : null}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <BoardPagination page={page} totalPages={totalPages} basePath={basePath} query={query} />
    </>
  );
}
