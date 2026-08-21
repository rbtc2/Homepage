import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ViewTracker';
import SafeHtml from '@/components/board/SafeHtml';
import SecretPostGate from '@/components/board/SecretPostGate';
import {
  getGalleryById,
  getGalleryPrevNext,
  getGallerySecretAuth,
  localizeGalleryPost,
} from '@/lib/gallery';
import { galleryUi } from '@/lib/gallery-ui';
import { canReadSecretPost, SECRET_BOARD_CONFIG } from '@/lib/secret-post';

export default async function GalleryDetailView({ id, locale = 'ko' }) {
  const raw = await getGalleryById(id);
  if (!raw) notFound();

  const post = localizeGalleryPost(raw, locale);
  const ui = galleryUi(locale);
  const basePath = locale === 'en' ? '/en/gallery' : '/gallery';
  const homePath = locale === 'en' ? '/en' : '/';

  const secretAuth = await getGallerySecretAuth(id);
  const board = SECRET_BOARD_CONFIG.gallery;
  const canRead = await canReadSecretPost({
    ...secretAuth,
    cookiePrefix: board.cookiePrefix,
    id,
  });

  const { prev, next } = await getGalleryPrevNext(id, locale);

  return (
    <>
      <ViewTracker table="gallery" id={id} />
      <main role="main">
        <div className="gd-wrap">
          <nav className="gd-crumb" aria-label={ui.crumbAria}>
            <Link href={homePath} className="gd-crumb__link">
              {ui.home}
            </Link>
            <span className="gd-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href={basePath} className="gd-crumb__link">
              {ui.title}
            </Link>
            <span className="gd-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="gd-crumb__current" aria-current="page">
              {ui.crumbCurrent}
            </span>
          </nav>

          <article className="gd">
            <header className="gd__hd">
              <h1 className="gd__title">{post.title}</h1>
              <div className="gd__byline">
                <span className="gd__byline-item">
                  <span className="gd__byline-label">{ui.author}</span>
                  {post.author}
                </span>
                <span className="gd__byline-dot" aria-hidden="true" />
                <time className="gd__byline-item" dateTime={post.createdAt}>
                  {post.createdAt}
                </time>
                <span className="gd__byline-dot" aria-hidden="true" />
                <span className="gd__byline-item">{ui.viewsByline(post.views)}</span>
              </div>
            </header>

            {canRead ? (
              <>
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={1600}
                    height={1200}
                    className="gd__cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 1180px"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                ) : (
                  <div className="gd__cover-placeholder" aria-hidden="true">
                    <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                      <rect
                        x="4"
                        y="8"
                        width="32"
                        height="25"
                        rx="2.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
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
                )}
                <SafeHtml html={post.content} className="nd__body nd__body--html" />
              </>
            ) : (
              <SecretPostGate board="gallery" id={id} />
            )}
          </article>

          <nav className="gd-sibling" aria-label={ui.siblingAria}>
            {next ? (
              <Link href={`${basePath}/${next.id}`} className="gd-sibling__item">
                <span className="gd-sibling__dir">
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
                <span className="gd-sibling__title">{next.title}</span>
              </Link>
            ) : null}
            {prev ? (
              <Link href={`${basePath}/${prev.id}`} className="gd-sibling__item">
                <span className="gd-sibling__dir">
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
                <span className="gd-sibling__title">{prev.title}</span>
              </Link>
            ) : null}
          </nav>

          <div className="gd-foot">
            <Link href={basePath} className="gd-foot__back">
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
