import Link from 'next/link';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ViewTracker';
import SafeHtml from '@/components/board/SafeHtml';
import SecretPostGate from '@/components/board/SecretPostGate';
import {
  getNoticeById,
  getNoticeSecretAuth,
  getPrevNext,
  localizeNotice,
} from '@/lib/notices';
import { noticesUi } from '@/lib/notices-ui';
import { canReadSecretPost, SECRET_BOARD_CONFIG } from '@/lib/secret-post';

export default async function NoticeDetailView({ id, locale = 'ko' }) {
  const raw = await getNoticeById(id);
  if (!raw) notFound();

  const notice = localizeNotice(raw, locale);
  const ui = noticesUi(locale);
  const basePath = locale === 'en' ? '/en/notices' : '/notices';
  const homePath = locale === 'en' ? '/en' : '/';

  const secretAuth = await getNoticeSecretAuth(id);
  const board = SECRET_BOARD_CONFIG.notices;
  const canRead = await canReadSecretPost({
    ...secretAuth,
    cookiePrefix: board.cookiePrefix,
    id,
  });

  const { prev, next } = await getPrevNext(id, locale);

  return (
    <>
      <ViewTracker table="notices" id={id} />
      <main role="main">
        <div className="nd-wrap">
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

          <article className="nd">
            <header className="nd__hd">
              {notice.isPinned ? <span className="nd__pin-badge">{ui.pin}</span> : null}
              <h1 className="nd__title">{notice.title}</h1>
              <div className="nd__byline">
                <span className="nd__byline-item">
                  <span className="nd__byline-label">{ui.author}</span>
                  {notice.author}
                </span>
                <span className="nd__byline-dot" aria-hidden="true" />
                <time className="nd__byline-item" dateTime={notice.createdAt}>
                  {notice.createdAt}
                </time>
                <span className="nd__byline-dot" aria-hidden="true" />
                <span className="nd__byline-item">{ui.viewsByline(notice.views)}</span>
              </div>
            </header>

            {canRead ? (
              <SafeHtml html={notice.content} className="nd__body nd__body--html" />
            ) : (
              <SecretPostGate board="notices" id={id} />
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
