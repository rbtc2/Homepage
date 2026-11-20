import Link from 'next/link';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ViewTracker';
import SafeHtml from '@/components/board/SafeHtml';
import SecretPostGate from '@/components/board/SecretPostGate';
import CategoryMark from '@/components/board/CategoryMark';
import { getArchiveById, getArchiveSecretAuth, getPrevNext } from '@/lib/archive';
import { archivePublicPath, getArchiveCategoryState, visibleCategoryLabel } from '@/lib/archive-categories';
import { homeHref } from '@/lib/i18n';
import { canReadSecretPost, SECRET_BOARD_CONFIG } from '@/lib/secret-post';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const archive = await getArchiveById(id);
  if (!archive) return { title: '자료실 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${archive.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function ArchiveDetailPage({ params, locale = 'ko' }) {
  const { id } = await params;
  const basePath = archivePublicPath(locale);
  const [archive, categoryState] = await Promise.all([
    getArchiveById(id),
    getArchiveCategoryState(),
  ]);
  if (!archive) notFound();
  const categoryText = visibleCategoryLabel(categoryState, archive.categoryId, locale);
  const secretAuth = await getArchiveSecretAuth(id);
  const board = SECRET_BOARD_CONFIG.archive;
  const canRead = await canReadSecretPost({
    ...secretAuth,
    cookiePrefix: board.cookiePrefix,
    id,
  });

  const { prev, next } = await getPrevNext(id);

  return (
    <>
      <ViewTracker table="archive" id={id} />
      <main role="main">
        <div className="nd-wrap">
          <nav className="nd-crumb" aria-label="위치">
            <Link href={homeHref(locale)} className="nd-crumb__link">
              홈
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href={basePath} className="nd-crumb__link">
              자료실
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="nd-crumb__current" aria-current="page">
              상세
            </span>
          </nav>

          <article className="nd">
            <header className="nd__hd">
              <h1 className="nd__title">
                <CategoryMark label={categoryText} />
                {archive.title}
              </h1>
              <div className="nd__byline">
                <span className="nd__byline-item">
                  <span className="nd__byline-label">작성자</span>
                  {archive.author}
                </span>
                <span className="nd__byline-dot" aria-hidden="true" />
                <time className="nd__byline-item" dateTime={archive.createdAt}>
                  {archive.createdAt}
                </time>
                <span className="nd__byline-dot" aria-hidden="true" />
                <span className="nd__byline-item">
                  조회&nbsp;{archive.views.toLocaleString()}
                </span>
              </div>
            </header>

            {canRead ? (
              <SafeHtml html={archive.content} className="nd__body nd__body--html" />
            ) : (
              <SecretPostGate board="archive" id={id} />
            )}
          </article>

          <nav className="nd-sibling" aria-label="이전·다음 글">
            {next && (
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
                  다음 자료
                </span>
                <span className="nd-sibling__title">{next.title}</span>
              </Link>
            )}
            {prev && (
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
                  이전 자료
                </span>
                <span className="nd-sibling__title">{prev.title}</span>
              </Link>
            )}
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
              목록으로
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
