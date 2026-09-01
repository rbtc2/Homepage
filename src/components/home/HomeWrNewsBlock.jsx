import Link from 'next/link';
import Image from 'next/image';
import { getWrNewsPage, localizeWrNewsPosts } from '@/lib/wr-news';

const LIST_PATH_KO = '/wr-news';
const LIST_PATH_EN = '/en/wr-news';
const HOME_ITEMS = 4;

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

export default async function HomeWrNewsBlock({ locale = 'ko' }) {
  const { items: rawItems } = await getWrNewsPage({ page: 1, itemsPerPage: HOME_ITEMS });
  const items = localizeWrNewsPosts(rawItems, locale);
  const primary = items[0];
  const secondary = items.slice(1, HOME_ITEMS);
  const multi = secondary.length > 0;
  const isEn = locale === 'en';
  const listPath = isEn ? LIST_PATH_EN : LIST_PATH_KO;

  return (
    <section className="hmwr" aria-labelledby="hmwr-heading">
      <div className="hmwr__inner">
        <header className="hmwr__head">
          <h2 id="hmwr-heading" className="hmwr__eyebrow">
            {isEn ? 'WR News' : 'WR뉴스'}
          </h2>
          <hr className="hmwr__rule" />
          <Link href={listPath} className="hmwr__all">
            {isEn ? 'View all' : '전체보기'}
            <Chevron />
          </Link>
        </header>

        {items.length === 0 ? (
          <p className="hmwr__zero">
            {isEn ? 'No posts yet. ' : '등록된 글이 없습니다. '}
            <Link href={listPath}>{isEn ? 'WR News list' : 'WR뉴스 목록'}</Link>
          </p>
        ) : (
          <div className={multi ? 'hmwr__grid' : 'hmwr__grid hmwr__grid--one'}>
            {primary ? (
              <Link href={`${listPath}/${primary.id}`} className="hmwr__hero">
                <span className="hmwr__hero-frame">
                  {primary.coverImage ? (
                    <Image
                      className="hmwr__hero-img"
                      src={primary.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 1180px"
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="hmwr__hero-fallback" aria-hidden="true" />
                  )}
                </span>
                <span className="hmwr__hero-body">
                  <span className="hmwr__hero-name">{primary.title}</span>
                  {toPlainSnippet(primary.content, 120) ? (
                    <span className="hmwr__hero-snip">
                      {toPlainSnippet(primary.content, 120)}
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
              </Link>
            ) : null}

            {multi ? (
              <ul className={`hmwr__subs hmwr__subs--n${secondary.length}`} role="list">
                {secondary.map((row) => (
                  <li key={row.id} className="hmwr__sub-item">
                    <Link href={`${listPath}/${row.id}`} className="hmwr__sub">
                      <span className="hmwr__sub-pic">
                        {row.coverImage ? (
                          <Image
                            className="hmwr__sub-img"
                            src={row.coverImage}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 72px, 33vw"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span className="hmwr__sub-fallback" aria-hidden="true" />
                        )}
                      </span>
                      <span className="hmwr__sub-text">
                        <span className="hmwr__sub-name">{row.title}</span>
                        {formatYmd(row.createdAt) ? (
                          <time className="hmwr__sub-when" dateTime={row.createdAt}>
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
