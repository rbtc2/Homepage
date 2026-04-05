import Link from 'next/link';
import Image from 'next/image';
import { getWrNewsPage } from '@/lib/wr-news';

const LIST_PATH = '/wr-news';

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

function Chevron() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function HomeWrNewsBlock() {
  const { items } = await getWrNewsPage({ page: 1, itemsPerPage: 3 });
  const primary = items[0];
  const secondary = items.slice(1, 3);
  const multi = secondary.length > 0;

  return (
    <section className="hmwr" aria-labelledby="hmwr-heading">
      <div className="hmwr__inner">
        <header className="hmwr__head">
          <h2 id="hmwr-heading" className="hmwr__title">
            WR뉴스
          </h2>
          <hr className="hmwr__rule" />
          <Link href={LIST_PATH} className="hmwr__all">
            전체보기
            <Chevron />
          </Link>
        </header>

        {items.length === 0 ? (
          <p className="hmwr__zero">
            등록된 글이 없습니다.{' '}
            <Link href={LIST_PATH}>WR뉴스 목록</Link>
          </p>
        ) : (
          <div className={multi ? 'hmwr__grid' : 'hmwr__grid hmwr__grid--one'}>
            {primary ? (
              <Link
                href={`${LIST_PATH}/${primary.id}`}
                className="hmwr__hero"
              >
                <span className="hmwr__hero-frame">
                  {primary.coverImage ? (
                    <Image
                      className="hmwr__hero-img"
                      src={primary.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 65vw"
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="hmwr__hero-fallback" aria-hidden="true" />
                  )}
                  <span className="hmwr__hero-shade" aria-hidden="true" />
                  <span className="hmwr__hero-panel">
                    <span className="hmwr__hero-name">{primary.title}</span>
                    {toPlainSnippet(primary.content, 140) ? (
                      <span className="hmwr__hero-snip">
                        {toPlainSnippet(primary.content, 140)}
                      </span>
                    ) : null}
                    <span className="hmwr__hero-byline">
                      <span>{primary.author}</span>
                      {formatYmd(primary.createdAt) ? (
                        <>
                          <span className="hmwr__dot" aria-hidden="true" />
                          <time dateTime={primary.createdAt}>
                            {formatYmd(primary.createdAt)}
                          </time>
                        </>
                      ) : null}
                    </span>
                  </span>
                </span>
              </Link>
            ) : null}

            {multi ? (
              <ul className="hmwr__subs" role="list">
                {secondary.map((row) => (
                  <li key={row.id} className="hmwr__sub-item">
                    <Link
                      href={`${LIST_PATH}/${row.id}`}
                      className="hmwr__sub"
                    >
                      <span className="hmwr__sub-pic">
                        {row.coverImage ? (
                          <Image
                            className="hmwr__sub-img"
                            src={row.coverImage}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 34vw"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span
                            className="hmwr__sub-fallback"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="hmwr__sub-text">
                        <span className="hmwr__sub-name">{row.title}</span>
                        {toPlainSnippet(row.content, 90) ? (
                          <span className="hmwr__sub-snip">
                            {toPlainSnippet(row.content, 90)}
                          </span>
                        ) : null}
                        {formatYmd(row.createdAt) ? (
                          <time
                            className="hmwr__sub-when"
                            dateTime={row.createdAt}
                          >
                            {formatYmd(row.createdAt)}
                          </time>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
