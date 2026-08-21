import Link from 'next/link';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ViewTracker';
import SafeHtml from '@/components/board/SafeHtml';
import SecretPostGate from '@/components/board/SecretPostGate';
import { isEmptyPostHtml } from '@/lib/is-empty-post-html';
import { getPressById, getPrevNextPress, getPressSecretAuth } from '@/lib/press-coverage';
import { pressUi } from '@/lib/press-ui';
import { canReadSecretPost, SECRET_BOARD_CONFIG } from '@/lib/secret-post';

export default async function PressDetailView({ id, locale = 'ko' }) {
  const row = await getPressById(id);
  if (!row) notFound();

  const ui = pressUi(locale);
  const basePath = locale === 'en' ? '/en/press' : '/press';
  const homePath = locale === 'en' ? '/en' : '/';

  const secretAuth = await getPressSecretAuth(id);
  const board = SECRET_BOARD_CONFIG.press_coverage;
  const canRead = await canReadSecretPost({
    ...secretAuth,
    cookiePrefix: board.cookiePrefix,
    id,
  });

  const { prev, next } = await getPrevNextPress(id);
  const hasBody = !isEmptyPostHtml(row.content);

  return (
    <>
      <ViewTracker table="press_coverage" id={id} />
      <main role="main">
        <div className="nd-wrap pd-wrap">
          <nav className="nd-crumb" aria-label={ui.crumbAria}>
            <Link href={homePath} className="nd-crumb__link">
              {ui.home}
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href={basePath} className="nd-crumb__link">
              {ui.title}
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="nd-crumb__current" aria-current="page">
              {ui.crumbCurrent}
            </span>
          </nav>

          <article className="nd pd">
            <header className="nd__hd pd__hd">
              {row.isFeatured ? <span className="pd__badge">{ui.featuredDetail}</span> : null}
              <h1 className="nd__title">{row.title}</h1>
              {canRead ? (
                <div className="pd__source-card">
                  <dl className="pd__dl">
                    <div className="pd__dl-row">
                      <dt>{ui.source}</dt>
                      <dd>{row.sourceName}</dd>
                    </div>
                    <div className="pd__dl-row">
                      <dt>{ui.publishedOn}</dt>
                      <dd>
                        <time dateTime={row.publishedAt}>{row.publishedAt}</time>
                      </dd>
                    </div>
                    <div className="pd__dl-row">
                      <dt>{ui.registeredOn}</dt>
                      <dd>
                        <time dateTime={row.createdAt}>{row.createdAt}</time>
                      </dd>
                    </div>
                    <div className="pd__dl-row">
                      <dt>{ui.views}</dt>
                      <dd>{row.views.toLocaleString()}</dd>
                    </div>
                  </dl>
                  <div className="pd__cta">
                    <a
                      href={row.articleUrl}
                      className="pd__btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ui.readOriginal}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                    <p className="pd__cta-note">{ui.externalNote}</p>
                  </div>
                </div>
              ) : null}
            </header>

            {canRead ? (
              hasBody ? (
                <SafeHtml html={row.content} className="nd__body nd__body--html pd__body" />
              ) : null
            ) : (
              <SecretPostGate board="press_coverage" id={id} locale={locale} />
            )}
          </article>

          <nav className="nd-sibling" aria-label={ui.siblingAria}>
            {next ? (
              <Link href={`${basePath}/${next.id}`} className="nd-sibling__item">
                <span className="nd-sibling__dir">
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
                <span className="nd-sibling__title">{next.title}</span>
              </Link>
            ) : null}
            {prev ? (
              <Link href={`${basePath}/${prev.id}`} className="nd-sibling__item">
                <span className="nd-sibling__dir">
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
                <span className="nd-sibling__title">{prev.title}</span>
              </Link>
            ) : null}
          </nav>

          <div className="nd-foot">
            <Link href={basePath} className="nd-foot__back">
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
