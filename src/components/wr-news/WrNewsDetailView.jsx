import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ViewTracker';
import SafeHtml from '@/components/board/SafeHtml';
import SecretPostGate from '@/components/board/SecretPostGate';
import {
  getWrNewsById,
  getWrNewsPrevNext,
  getWrNewsSecretAuth,
  localizeWrNewsPost,
} from '@/lib/wr-news';
import { wrNewsUi } from '@/lib/wr-news-ui';
import { canReadSecretPost, SECRET_BOARD_CONFIG } from '@/lib/secret-post';

export default async function WrNewsDetailView({ id, locale = 'ko' }) {
  const raw = await getWrNewsById(id);
  if (!raw) notFound();

  const post = localizeWrNewsPost(raw, locale);
  const ui = wrNewsUi(locale);
  const basePath = locale === 'en' ? '/en/wr-news' : '/wr-news';
  const homePath = locale === 'en' ? '/en' : '/';

  const secretAuth = await getWrNewsSecretAuth(id);
  const board = SECRET_BOARD_CONFIG.wr_news;
  const canRead = await canReadSecretPost({
    isSecret: secretAuth.isSecret,
    secretPasswordHash: secretAuth.secretPasswordHash,
    cookiePrefix: board.cookiePrefix,
    id,
  });

  const { prev, next } = await getWrNewsPrevNext(id, locale);

  return (
    <>
      <ViewTracker table="wr_news" id={id} />
      <main role="main" className="wna-page">
        <div className="wna-wrap">
          <nav className="wna-crumb" aria-label={locale === 'en' ? 'Breadcrumb' : '위치'}>
            <Link href={homePath} className="wna-crumb__link">
              {ui.home}
            </Link>
            <span className="wna-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href={basePath} className="wna-crumb__link">
              {ui.title}
            </Link>
            <span className="wna-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="wna-crumb__current" aria-current="page">
              {ui.crumbCurrent}
            </span>
          </nav>

          <article className="wna">
            <header className="wna__hd">
              <p className="wna__eyebrow">{ui.title}</p>
              <h1 className="wna__title">{post.title}</h1>
              <div className="wna__byline">
                <span className="wna__byline-item">
                  <span className="wna__byline-label">{ui.author}</span>
                  {post.author}
                </span>
                <span className="wna__byline-dot" aria-hidden="true" />
                <time className="wna__byline-item" dateTime={post.createdAt}>
                  {post.createdAt}
                </time>
                <span className="wna__byline-dot" aria-hidden="true" />
                <span className="wna__byline-item">{ui.viewsByline(post.views)}</span>
              </div>
            </header>

            {canRead ? (
              <>
                {post.coverImage ? (
                  <figure className="wna__cover">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={1600}
                      height={1200}
                      className="wna__cover-img"
                      priority
                      sizes="(max-width: 768px) 100vw, 720px"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </figure>
                ) : null}
                <SafeHtml html={post.content} className="wna__body nd__body--html" />
              </>
            ) : (
              <SecretPostGate board="wr_news" id={id} />
            )}
          </article>

          <nav className="wna-sibling" aria-label={ui.siblingAria}>
            {next ? (
              <Link href={`${basePath}/${next.id}`} className="wna-sibling__item">
                <span className="wna-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 8L6 4L10 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {ui.next}
                </span>
                <span className="wna-sibling__title">{next.title}</span>
              </Link>
            ) : null}
            {prev ? (
              <Link href={`${basePath}/${prev.id}`} className="wna-sibling__item">
                <span className="wna-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {ui.prev}
                </span>
                <span className="wna-sibling__title">{prev.title}</span>
              </Link>
            ) : null}
          </nav>

          <div className="wna-foot">
            <Link href={basePath} className="wna-foot__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M8.5 3L5 7L8.5 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {ui.backToList}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
